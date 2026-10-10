-- Výslovný souhlas se zpracováním zdravotních údajů dítěte (čl. 9 odst. 2
-- písm. a) GDPR).
--
-- /gdpr ho slibuje, ale přihláška ho až do 10. 10. 2026 sbírala jen jako
-- součást obecného souhlasu se zpracováním osobních údajů. Výslovný souhlas
-- nesmí být schovaný v jiném, proto má vlastní sloupec. Formulář ho vyžaduje
-- jen tehdy, když rodič zdravotní údaje vyplní, a API (`registrationSchema`)
-- registraci se zdravotními údaji bez souhlasu odmítne — sloupec je tedy
-- doklad o souhlasu, ne podmínka.
--
-- Pořadí nasazení je volné: dokud migrace neproběhne, RPC klíč
-- `health_consent` z payloadu tiše ignoruje (registrace fungují dál, jen se
-- souhlas neuloží). Proto ji spusť co nejdřív po nasazení webu.
--
-- Mimo nový sloupec je create_registration() beze změny proti 018.

ALTER TABLE registrations ADD COLUMN IF NOT EXISTS health_consent BOOLEAN NOT NULL DEFAULT false;

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

  -- A spot is held by a PAID registration, or by a still-fresh pending payment
  -- (created within the payment window). Abandoned pendings older than 60 min are
  -- ignored and their spot is freed automatically.
  SELECT count(*) INTO active_count
  FROM registrations
  WHERE term_id = v_term_id
    AND status <> 'cancelled'
    AND (
      payment_status = 'completed'
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
    payment_amount,
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
    COALESCE((payload->>'vop_accepted_at')::timestamptz, now()),
    payload->>'vop_accepted_ip'
  )
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;
