-- Fix packages table schema - add missing columns
ALTER TABLE packages ADD COLUMN IF NOT EXISTS includes TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS excludes TEXT;

-- Verify the schema
\d packages;
