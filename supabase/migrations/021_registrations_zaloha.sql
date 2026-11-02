-- Záloha + doplatek na turnusy (léto 2027).
--
-- Rodič může zaplatit celou cenu, nebo jen zálohu a zbytek do `doplatekDo`
-- (turnus.zaloha v src/lib/turnusy.ts). Tahle migrace přidává to, co k tomu
-- databáze potřebuje:
--
--   1. payment_status smí být 'partial' — záloha zaplacena, doplatek ještě ne.
--   2. payment_plan ('plna' | 'zaloha') — jaký plán rodič zvolil. Existující
--      řádky dostanou 'plna', takže se na ně nesahá.
--   3. sloupce pro idempotentní připomínky doplatku (cron /api/cron/doplatek).
--   4. registration_payments — jedna řádka za každou platbu Comgate. Přihláška
--      může mít víc plateb (záloha + doplatek). RLS je zapnuté bez policy:
--      k tabulce se dostane jen service role.
--   5. create_registration() přijme payment_plan a místo drží i 'partial'.
--
-- Pravidlo kapacity se musí shodovat s `src/app/api/term-capacity/route.ts`.
-- Migrace 020 je obsazená nenasazenou větví feat/turnusy-z-hubu; tahle
-- migrace na ní nezávisí.
--
-- Idempotentní: IF NOT EXISTS / DROP ... IF EXISTS, funkce přes CREATE OR REPLACE.
-- Pořadí nasazení: migrace → hub → web (hub na 'partial' musí umět spadnout
-- do fallbacku, jinak by stránka přihlášky spadla).

-- 1. payment_status: Postgres pojmenoval inline CHECK z migrace 009 jako
--    registrations_payment_status_check. Dropneme ho a přidáme znovu s 'partial'.
ALTER TABLE registrations DROP CONSTRAINT IF EXISTS registrations_payment_status_check;
ALTER TABLE registrations
  ADD CONSTRAINT registrations_payment_status_check
  CHECK (payment_status IN ('pending', 'completed', 'partial', 'refunded'));

-- 2. Zvolený plán platby. Existující řádky = plná platba (to, co dnes platí).
ALTER TABLE registrations
  ADD COLUMN IF NOT EXISTS payment_plan TEXT NOT NULL DEFAULT 'plna'
  CHECK (payment_plan IN ('plna', 'zaloha'));

-- 3. Idempotentní připomínky doplatku. NULL = ještě neodesláno; timestamp =
--    odesláno (nebo claimnuto cronem). Cron vrací NULL, jen když odeslání selže.
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS doplatek_reminder_14_at TIMESTAMPTZ;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS doplatek_reminder_3_at TIMESTAMPTZ;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS doplatek_overdue_alert_at TIMESTAMPTZ;

-- 4. Jedna řádka za každou platbu Comgate. comgate_trans_id je unikátní: callback
--    podle něj najde, o kterou platbu jde.
CREATE TABLE IF NOT EXISTS registration_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_id UUID NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('plna', 'zaloha', 'doplatek')),
  amount_kc INTEGER NOT NULL CHECK (amount_kc > 0),
  comgate_trans_id TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'cancelled', 'refunded')),
  paid_at TIMESTAMPTZ,
  fakturoid_invoice_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_registration_payments_registration
  ON registration_payments(registration_id);

ALTER TABLE registration_payments ENABLE ROW LEVEL SECURITY;

-- 5. create_registration(): tělo z migrace 019 beze změny, až na tři místa:
--    - počítá se i 'partial' (místo drží zaplacená záloha),
--    - payment_plan z payloadu (výchozí 'plna', když chybí),
--    - v insertu je nový sloupec payment_plan.
CREATE OR REPLACE FUNCTION create_registration(payload jsonb, max_capacity integer)
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
  new_id uuid;
  active_count integer;
  v_term_id text := payload->>'term_id';
BEGIN
  IF v_term_id IS NULL OR v_term_id = '' THEN
    RAISE EXCEPTION 'MISSING_TERM_ID';
  END IF;

  -- Serialize concurrent inserts for this term only (released at COMMIT/ROLLBACK).
  PERFORM pg_advisory_xact_lock(hashtext(v_term_id));

  -- A spot is held by a PAID registration (in full or a deposit paid, 'partial'),
  -- or by a still-fresh pending payment (created within the payment window).
  -- Abandoned pendings older than 60 min are ignored and their spot is freed.
  SELECT count(*) INTO active_count
  FROM registrations
  WHERE term_id = v_term_id
    AND status <> 'cancelled'
    AND (
      payment_status IN ('completed', 'partial')
      OR created_at > now() - interval '60 minutes'
    );

  IF active_count >= max_capacity THEN
    RAISE EXCEPTION 'CAPACITY_FULL';
  END IF;

  INSERT INTO registrations (
    status, payment_status,
    location_id, program, term_id, term_start, term_end,
    parent_name, parent_email, parent_phone, parent_address,
    child_name, child_birthdate, child_insurance, child_health_notes, child_experience,
    pickup_method, pickup_time, pickup_persons,
    vop_consent, gdpr_consent, photo_consent, marketing_consent, health_consent,
    customer_note,
    payment_amount, payment_plan,
    vop_accepted_at, vop_accepted_ip
  ) VALUES (
    'pending', 'pending',
    payload->>'location_id', payload->>'program', v_term_id,
    (payload->>'term_start')::date, (payload->>'term_end')::date,
    payload->>'parent_name', payload->>'parent_email', payload->>'parent_phone', payload->>'parent_address',
    payload->>'child_name', (payload->>'child_birthdate')::date, payload->>'child_insurance',
    NULLIF(payload->>'child_health_notes', ''), NULLIF(payload->>'child_experience', ''),
    payload->>'pickup_method', NULLIF(payload->>'pickup_time', ''), NULLIF(payload->>'pickup_persons', ''),
    (payload->>'vop_consent')::boolean, (payload->>'gdpr_consent')::boolean,
    COALESCE((payload->>'photo_consent')::boolean, false),
    COALESCE((payload->>'marketing_consent')::boolean, false),
    COALESCE((payload->>'health_consent')::boolean, false),
    NULLIF(payload->>'customer_note', ''),
    (payload->>'payment_amount')::integer,
    COALESCE(NULLIF(payload->>'payment_plan', ''), 'plna'),
    COALESCE((payload->>'vop_accepted_at')::timestamptz, now()),
    payload->>'vop_accepted_ip'
  )
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;
