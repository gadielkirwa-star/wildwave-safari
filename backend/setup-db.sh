#!/bin/bash

echo "🗄️  Setting up WildWave Safaris Database..."

# Create database and user
sudo -u postgres psql << EOF
-- Create user if not exists
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'wildwave_user') THEN
    CREATE USER wildwave_user WITH PASSWORD 'wildwave_pass';
  END IF;
END
\$\$;

-- Drop database if exists and recreate
DROP DATABASE IF EXISTS wildwave_safaris;
CREATE DATABASE wildwave_safaris OWNER wildwave_user;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE wildwave_safaris TO wildwave_user;
EOF

# Apply full schema and seed data
PGPASSWORD=wildwave_pass psql -U wildwave_user -d wildwave_safaris -f schema.sql

echo "✅ Database setup complete!"
echo ""
echo "📊 Database: wildwave_safaris"
echo "👤 User: wildwave_user"
echo "🔑 Password: wildwave_pass"
echo ""
echo "🔐 Admin Login:"
echo "   Email: wildwavesafaris@gmail.com"
echo "   Password: winny@2026"
