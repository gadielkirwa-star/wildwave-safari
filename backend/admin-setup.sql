INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'wildwavesafaris@gmail.com', '$2b$12$ixdo8pP8pyAafbVB.vUTR.Pm9JajzkeoEKUdQ1Q9R9AIBwN2Fwuue', 'admin')
ON CONFLICT (email) DO UPDATE SET 
  password = '$2b$12$ixdo8pP8pyAafbVB.vUTR.Pm9JajzkeoEKUdQ1Q9R9AIBwN2Fwuue',
  name = 'Admin User',
  role = 'admin';
