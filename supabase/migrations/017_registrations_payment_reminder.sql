-- Payment reminder: one-time email ~24h after an unpaid registration.
-- This column is the idempotency lock (same pattern as confirmation_sent_at /
-- nastupni_sent_at): NULL = not yet reminded; a timestamp = reminder claimed/sent.
-- The cron releases it back to NULL only if the send fails, so a later run retries.
ALTER TABLE registrations
  ADD COLUMN IF NOT EXISTS payment_reminder_sent_at TIMESTAMPTZ;
