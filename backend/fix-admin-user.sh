#!/bin/bash

# Ensure admin user exists in database with correct password

DB_HOST="dpg-d6baset6ubrc73cg59b0-a.oregon-postgres.render.com"
DB_USER="wildwave_user"
DB_NAME="wildwave_safaris"
DB_PASS="sS7IqFCVWjmL6uJETfEbRSm0OZtXGAlD"

echo "🔧 Fixing admin user login..."
echo ""

# Create or update admin user with correct password hash
# Password: admin123
# Hash: $2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIeWEHaSuu

PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -c "
INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@wildwavesafaris.com', '\$2b\$12\$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIeWEHaSuu', 'admin')
ON CONFLICT (email) DO UPDATE SET 
  password = '\$2b\$12\$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIeWEHaSuu',
  name = 'Admin User',
  role = 'admin';
"

echo "✅ Admin user setup complete!"
echo ""
echo "Login credentials:"
echo "  Email:    admin@wildwavesafaris.com"
echo "  Password: admin123"
echo ""

# Verify user was created/updated
echo "🔍 Verifying..."
PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -t -c "
SELECT 'Found: ' || email || ' (Role: ' || role || ')' FROM users WHERE email = 'admin@wildwavesafaris.com';
"

echo ""
echo "✅ You can now login to the admin dashboard:"
echo "   https://wildwave-safaris-admin.vercel.app"
