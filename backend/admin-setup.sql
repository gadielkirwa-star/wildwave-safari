INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@wildwavesafaris.com', '$2b$12$FH3eV/.QX8fwn27/1D5CyO57Q39Z6Ts2glf2L00kMgkKpFvZHQhuC', 'admin')
ON CONFLICT (email) DO UPDATE SET 
  password = '$2b$12$FH3eV/.QX8fwn27/1D5CyO57Q39Z6Ts2glf2L00kMgkKpFvZHQhuC',
  name = 'Admin User',
  role = 'admin';
