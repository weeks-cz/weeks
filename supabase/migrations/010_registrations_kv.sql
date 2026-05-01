-- Add KV registration fields: pickup method, photo consent, Comgate payment, VOP audit
ALTER TABLE registrations
  ADD COLUMN IF NOT EXISTS pickup_method TEXT CHECK (pickup_method IN ('solo', 'named_persons')),
  ADD COLUMN IF NOT EXISTS pickup_time TEXT,
  ADD COLUMN IF NOT EXISTS pickup_persons TEXT,
  ADD COLUMN IF NOT EXISTS photo_consent BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS comgate_payment_id TEXT,
  ADD COLUMN IF NOT EXISTS comgate_status TEXT,
  ADD COLUMN IF NOT EXISTS vop_accepted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS vop_accepted_ip TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_comgate_id
  ON registrations(comgate_payment_id)
  WHERE comgate_payment_id IS NOT NULL;
