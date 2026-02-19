# Admin Dashboard Login Fix

## Problem

Admin dashboard login is returning **HTTP 401 (Unauthorized)** errors.

This happens when:
1. Admin user doesn't exist in database
2. Admin password hash is incorrect
3. Backend authentication is failing

## Solution

The admin user needs to be created/updated in the database with the correct password hash for `admin123`.

### Quick Fix Command

Run this single command to fix admin login:

```bash
PGPASSWORD=sS7IqFCVWjmL6uJETfEbRSm0OZtXGAlD psql \
  -h dpg-d6baset6ubrc73cg59b0-a.oregon-postgres.render.com \
  -U wildwave_user \
  -d wildwave_safaris \
  -c "INSERT INTO users (name, email, password, role) VALUES ('Admin User', 'admin@wildw avesafaris.com', '\$2b\$12\$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIeWEHaSuu', 'admin') ON CONFLICT (email) DO UPDATE SET password = '\$2b\$12\$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIeWEHaSuu';"
```

### Or Use the Script

```bash
cd backend
bash fix-admin-user.sh
```

### Admin Credentials

- **Email**: `admin@wildwavesafaris.com`
- **Password**: `admin123`
- **Password Hash**: `$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIeWEHaSuu`

## Test Login

After running the fix, test with:

```bash
curl -X POST https://wildwave-safaris-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@wildwavesafaris.com","password":"admin123"}'
```

Expected response:
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@wildwavesafaris.com",
    "role": "admin"
  }
}
```

## Verify Admin User Exists

```bash
PGPASSWORD=sS7IqFCVWjmL6uJETfEbRSm0OZtXGAlD psql \
  -h dpg-d6baset6ubrc73cg59b0-a.oregon-postgres.render.com \
  -U wildwave_user \
  -d wildwave_safaris \
  -c "SELECT id, email, role FROM users WHERE email = 'admin@wildwavesafaris.com';"
```

## Admin URLs

- **Admin Dashboard**: https://wildwave-safaris-admin.vercel.app
- **API Endpoint**: https://wildwave-safaris-api.onrender.com/api/auth/login

