#!/bin/bash

# Apply pending database migrations to Render PostgreSQL

echo "🔧 Installing missing packages table columns..."

# Database credentials
DB_HOST="dpg-d6baset6ubrc73cg59b0-a.oregon-postgres.render.com"
DB_USER="wildwave_user"  
DB_NAME="wildwave_safaris"
DB_PASS="sS7IqFCVWjmL6uJETfEbRSm0OZtXGAlD"

# Apply migrations one by one
echo "Adding 'includes' column to packages..."
PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -c "
ALTER TABLE packages ADD COLUMN IF NOT EXISTS includes TEXT;
"

echo "Adding 'excludes' column to packages..."
PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -c "
ALTER TABLE packages ADD COLUMN IF NOT EXISTS excludes TEXT;
"

echo "✅ Verifying packages table structure..."
PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -c "
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'packages' ORDER BY ordinal_position;
"

echo ""
echo "✅ Database migration completed!"
echo ""
echo "Now you can:"
echo "1. Login to admin dashboard"
echo "2. Add packages with 'Includes' and 'Excludes' details"
echo "3. Main website will automatically show the same images and data"
