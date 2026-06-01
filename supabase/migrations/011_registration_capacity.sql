-- Anti-overbooking: atomic capacity-checked registration insert.
--
-- Problem: counting active registrations and then inserting in two separate
-- round-trips is a TOCTOU race — two concurrent payments for the last spot both
-- read "count < capacity" and both insert, overbooking the term.
--
-- Solution: a single transactional function that takes a per-term advisory lock,
-- counts active (non-cancelled) registrations, and inserts only if there is room.
-- pg_advisory_xact_lock serializes concurrent calls for the SAME term_id (keyed
-- by its hash) while letting different terms proceed in parallel. The lock is
-- released automatically at transaction end.
--
-- The API resolves the trusted max_capacity server-side (from locations config)
-- and passes the registration fields as a jsonb payload.

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

  -- A pending registration holds a spot (it has a payment in flight). Only a
  -- cancelled registration frees one.
  SELECT count(*) INTO active_count
  FROM registrations
  WHERE term_id = v_term_id
    AND status <> 'cancelled';

  IF active_count >= max_capacity THEN
    RAISE EXCEPTION 'CAPACITY_FULL';
  END IF;

  INSERT INTO registrations (
    status, payment_status,
    location_id, program, term_id, term_start, term_end,
    parent_name, parent_email, parent_phone, parent_address,
    child_name, child_birthdate, child_insurance, child_health_notes, child_experience,
    pickup_method, pickup_time, pickup_persons,
    vop_consent, gdpr_consent, photo_consent, marketing_consent,
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
    (payload->>'payment_amount')::integer,
    COALESCE((payload->>'vop_accepted_at')::timestamptz, now()),
    payload->>'vop_accepted_ip'
  )
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;
