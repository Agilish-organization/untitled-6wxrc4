CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  company_name TEXT NOT NULL,
  website TEXT NOT NULL,
  industry TEXT,
  location TEXT,
  contact_name TEXT NOT NULL,
  contact_title TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  enrichment_source TEXT DEFAULT 'seed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
