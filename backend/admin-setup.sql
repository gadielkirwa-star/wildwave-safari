INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@wildwavesafaris.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIeWEHaSuu', 'admin')
ON CONFLICT (email) DO UPDATE SET 
  password = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIeWEHaSuu',
  name = 'Admin User',
  role = 'admin';
