#!/bin/bash
set -e

# Production database credentials
DB_HOST="dpg-d6baset6ubrc73cg59b0-a.oregon-postgres.render.com"
DB_USER="wildwave_user"
DB_NAME="wildwave_safaris"
DB_PASS="sS7IqFCVWjmL6uJETfEbRSm0OZtXGAlD"

echo "Setting up admin user in production database..."

# Use the existing known-good hash
PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -c "
DELETE FROM users WHERE email = 'admin@wildwavesafaris.com';
INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@wildwavesafaris.com', '\$2b\$12\$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIeWEHaSuu', 'admin');
"

echo "✅ Admin user setup complete"
echo ""
echo "Testing login..."
curl -s -X POST https://wildwave-safaris-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@wildwavesafaris.com","password":"admin123"}' | grep -o '"token"' && echo "✅ Login successful!" || echo "❌ Login failed"
