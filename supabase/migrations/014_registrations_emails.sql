-- Transactional email idempotency guards.
--
-- confirmation_sent_at: set when the post-payment confirmation email is sent
--   (the Comgate callback can fire multiple times → send exactly once).
-- nastupni_sent_at: set when the ~7-days-before nástupní list is sent by the
--   daily cron → never resend.
ALTER TABLE registrations
  ADD COLUMN IF NOT EXISTS confirmation_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS nastupni_sent_at TIMESTAMPTZ;
