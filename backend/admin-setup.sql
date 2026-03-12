INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'wildwavesafaris@gmail.com', '$2b$12$97kyaXiVAgaew6IwRNjDfO68uoV.fB9EeMTrl619z1yA8KSjXbWHO', 'admin')
ON CONFLICT (email) DO UPDATE SET 
  password = '$2b$12$97kyaXiVAgaew6IwRNjDfO68uoV.fB9EeMTrl619z1yA8KSjXbWHO',
  name = 'Admin User',
  role = 'admin';
