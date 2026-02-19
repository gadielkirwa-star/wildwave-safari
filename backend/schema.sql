-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Destinations table
CREATE TABLE IF NOT EXISTS destinations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  duration VARCHAR(100),
  image_url TEXT,
  category VARCHAR(100),
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  safari_type VARCHAR(255),
  number_of_people INTEGER,
  start_date DATE,
  total_price DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enquiries table
CREATE TABLE IF NOT EXISTS enquiries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(255),
  message TEXT,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  excerpt TEXT,
  content TEXT,
  image_url TEXT,
  read_time VARCHAR(50),
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert admin user (password: admin123)
INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@wildwavesafaris.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIeWEHaSuu', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert sample destinations
INSERT INTO destinations (name, description, price, duration, image_url, category) VALUES
('Masai Mara Safari', 'Experience the great wildebeest migration', 3500.00, '5 days', 'https://images.unsplash.com/photo-1516426122078-c23e76319801', 'Kenya'),
('Serengeti Adventure', 'Explore the endless plains of Tanzania', 4200.00, '7 days', 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e', 'Tanzania'),
('Gorilla Trekking Uganda', 'Meet mountain gorillas in their habitat', 5500.00, '4 days', 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44', 'Uganda'),
('Rwanda Wildlife Tour', 'Discover the land of a thousand hills', 4800.00, '6 days', 'https://images.unsplash.com/photo-1535083783855-76ae62b2914e', 'Rwanda'),
('Amboseli Elephant Safari', 'See elephants with Kilimanjaro backdrop', 3200.00, '4 days', 'https://images.unsplash.com/photo-1549366021-9f761d450615', 'Kenya'),
('Zanzibar Beach Escape', 'Relax on pristine white sand beaches', 2800.00, '5 days', 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f', 'Tanzania');

-- Insert sample bookings
INSERT INTO bookings (customer_name, email, phone, safari_type, number_of_people, start_date, total_price, status) VALUES
('John Smith', 'john@example.com', '+1234567890', 'Kenya Safari', 2, '2026-04-15', 7000.00, 'confirmed'),
('Sarah Johnson', 'sarah@example.com', '+1234567891', 'Tanzania Adventure', 4, '2026-05-20', 16800.00, 'pending'),
('Mike Brown', 'mike@example.com', '+1234567892', 'Uganda Gorilla Trek', 2, '2026-06-10', 11000.00, 'confirmed');

-- Insert sample enquiries
INSERT INTO enquiries (name, email, phone, message, status) VALUES
('Alice Cooper', 'alice@example.com', '+1234567893', 'I would like to know more about family safari packages', 'new'),
('Bob Wilson', 'bob@example.com', '+1234567894', 'Do you offer group discounts for 10+ people?', 'new');

-- Insert sample blogs
INSERT INTO blogs (title, category, excerpt, content, image_url, read_time, published) VALUES
('The Ultimate Packing List for an East African Safari', 'Travel Tips', 'From binoculars to bug spray — everything you need for your first safari adventure.', 'Complete guide to packing for your safari adventure...', 'https://images.unsplash.com/photo-1516426122078-c23e76319801', '5 min', true),
('When to Visit the Serengeti: A Month-by-Month Guide', 'Destination Guide', 'Each month brings different wildlife spectacles. Find the perfect time for your trip.', 'Detailed month-by-month breakdown of Serengeti seasons...', 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e', '7 min', true),
('Gorilla Trekking: What to Expect on Your First Trek', 'Experience', 'A detailed guide to preparing for and enjoying your mountain gorilla encounter.', 'Everything you need to know about gorilla trekking...', 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44', '6 min', true),
('Zanzibar Beyond the Beach: Culture, Spice & History', 'Destination Guide', 'Discover Stone Town, spice plantations, and the rich Swahili heritage of Zanzibar.', 'Explore the cultural richness of Zanzibar island...', 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f', '8 min', true),
('Hot Air Balloon Safari: Is It Worth the Splurge?', 'Experience', 'We break down costs, what to expect, and why it might be your trip''s highlight.', 'A comprehensive review of hot air balloon safaris...', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', '4 min', true),
('Ngorongoro Crater: Africa''s Garden of Eden', 'Destination Guide', 'Why this volcanic caldera is one of the most remarkable wildlife habitats on Earth.', 'Discover the wonders of Ngorongoro Crater...', 'https://images.unsplash.com/photo-1535083783855-76ae62b2914e', '6 min', true);

-- Packages table
CREATE TABLE IF NOT EXISTS packages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100),
  duration VARCHAR(100),
  price DECIMAL(10, 2),
  description TEXT,
  image_url TEXT,
  tag VARCHAR(50),
  itinerary TEXT,
  includes TEXT,
  excludes TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample packages
INSERT INTO packages (name, type, duration, price, description, image_url, tag, itinerary, published) VALUES
('Classic Game Drive', 'Classic', '7 Days', 2800.00, 'The quintessential East African safari through Kenya''s iconic parks.', 'https://images.unsplash.com/photo-1516426122078-c23e76319801', 'Most Popular', 'Day 1: Arrival in Nairobi. Day 2-5: Masai Mara game drives. Day 6: Hot air balloon safari. Day 7: Departure.', true),
('Gorilla Trekking Adventure', 'Gorilla Trekking', '5 Days', 4200.00, 'Trek through misty forests to meet mountain gorillas face-to-face.', 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44', 'Exclusive', 'Day 1: Arrive in Kampala. Day 2: Drive to Bwindi Impenetrable Forest. Day 3: Gorilla trekking. Day 4: Visit local villages. Day 5: Departure.', true),
('Balloon Safari Experience', 'Balloon Safaris', '10 Days', 5500.00, 'Float above the Serengeti at sunrise for a once-in-a-lifetime experience.', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', 'Premium', 'Day 1-2: Arrive Tanzania. Day 3-6: Serengeti with balloon safaris. Day 7-8: Ngorongoro Crater. Day 9-10: Zanzibar beach. Day 11: Departure.', true),
('Beach & Bush Combo', 'Beach Add-Ons', '12 Days', 3600.00, 'Combine thrilling game drives with Zanzibar''s pristine beaches.', 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f', 'Best Value', 'Day 1-3: Arrive and explore Dar es Salaam. Day 4-8: Serengeti safari. Day 9-12: Zanzibar beach relaxation.', true),
('Rwanda Discovery Tour', 'Classic', '6 Days', 3200.00, 'Discover the land of a thousand hills with stunning scenery and wildlife.', 'https://images.unsplash.com/photo-1535083783855-76ae62b2914e', 'Popular', 'Day 1: Arrive Kigali. Day 2-3: Volcanoes National Park. Day 4: Lake Kivu. Day 5: Nyungwe Forest. Day 6: Departure.', true),
('Tanzania Complete Experience', 'Classic', '8 Days', 4500.00, 'Experience all of Tanzania''s best: Serengeti, Kilimanjaro base, and Zanzibar.', 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e', 'Premium', 'Day 1-2: Arrive Dar. Day 3-5: Serengeti & Ngorongoro. Day 6: Kilimanjaro base camp. Day 7-8: Zanzibar.', true),
('Kenya Photography Safari', 'Classic', '10 Days', 6200.00, 'Perfect for photography enthusiasts. Capture the raw beauty of Kenya.', 'https://images.unsplash.com/photo-1516426122078-c23e76319801', 'Premium', 'Pre-dawn and sunset game drives daily. Professional photography guides. Front-row wildlife positioning.', true),
('Uganda Wildlife & Culture', 'Gorilla Trekking', '7 Days', 4800.00, 'Combine gorilla trekking with cultural experiences and pristine lakes.', 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44', 'Exclusive', 'Day 1-2: Kampala & negotiation with Batwa people. Day 3-4: Gorilla trekking. Day 5-7: Lake Bunyonyi & community visits.', true);

-- Promotions table
CREATE TABLE IF NOT EXISTS promotions (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  discount_text VARCHAR(255),
  button_text VARCHAR(100),
  button_link VARCHAR(255),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
