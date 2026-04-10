-- Registration system for internal (non-DDM) camp registrations
CREATE TABLE IF NOT EXISTS registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Status workflow: pending → paid → confirmed → cancelled
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'confirmed', 'cancelled')),

  -- Location & program
  location_id TEXT NOT NULL,
  program TEXT NOT NULL,
  term_id TEXT NOT NULL,
  term_start DATE NOT NULL,
  term_end DATE NOT NULL,

  -- Parent info
  parent_name TEXT NOT NULL,
  parent_email TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  parent_address TEXT NOT NULL,

  -- Child info
  child_name TEXT NOT NULL,
  child_birthdate DATE NOT NULL,
  child_insurance TEXT NOT NULL,
  child_health_notes TEXT,
  child_experience TEXT,

  -- Consents
  vop_consent BOOLEAN NOT NULL DEFAULT FALSE,
  gdpr_consent BOOLEAN NOT NULL DEFAULT FALSE,
  marketing_consent BOOLEAN DEFAULT FALSE,

  -- Payment
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'refunded')),
  payment_method TEXT,
  payment_amount INTEGER,
  payment_completed_at TIMESTAMPTZ,

  -- Admin
  notes TEXT,
  processed_by UUID
);

CREATE INDEX IF NOT EXISTS idx_registrations_location ON registrations(location_id);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(parent_email);
CREATE INDEX IF NOT EXISTS idx_registrations_term ON registrations(term_id);

ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create registrations"
  ON registrations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read registration by id"
  ON registrations FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can update registrations"
  ON registrations FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE OR REPLACE FUNCTION update_registrations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_registrations_updated_at
  BEFORE UPDATE ON registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_registrations_updated_at();
