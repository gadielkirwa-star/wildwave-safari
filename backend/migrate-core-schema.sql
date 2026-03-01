-- Core schema migration for existing databases (safe, idempotent)

CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_settings (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(50),
  email VARCHAR(255),
  whatsapp VARCHAR(50),
  address TEXT,
  office_hours TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS team_members (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  bio TEXT,
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE destinations ADD COLUMN IF NOT EXISTS country VARCHAR(100);
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS tags TEXT;
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS best_months TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS special_requests TEXT;
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS subject VARCHAR(255);
ALTER TABLE promotions ADD COLUMN IF NOT EXISTS info_text TEXT;
ALTER TABLE promotions ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS role VARCHAR(255);
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Normalize legacy/null publish flags so public pages can display updated records
UPDATE destinations SET published = true WHERE published IS NULL;
UPDATE packages SET published = true WHERE published IS NULL;
UPDATE blogs SET published = true WHERE published IS NULL;

INSERT INTO contact_settings (id, phone, email, whatsapp, address, office_hours) VALUES
(1, '+254 713 241 666', 'wildwavesafaris@gmail.com', '+254 713 241 666', 'Thika Road, Spur Mall, Nairobi', 'Mon - Fri: 8:00 AM - 6:00 PM (EAT)
Sat: 9:00 AM - 3:00 PM (EAT)
Sun: Closed')
ON CONFLICT (id) DO NOTHING;
