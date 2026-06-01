-- Fakturoid invoice idempotency.
--
-- The Comgate callback can fire multiple times for the same paid transaction.
-- We must issue exactly ONE daňový doklad. This column is the idempotency guard:
-- the callback atomically "claims" invoice generation by setting it from NULL to
-- 'pending' (only one concurrent callback wins that conditional update), then
-- stores the real Fakturoid invoice id. On failure it resets to NULL so a later
-- callback/retry can try again.
ALTER TABLE registrations
  ADD COLUMN IF NOT EXISTS fakturoid_invoice_id TEXT;
