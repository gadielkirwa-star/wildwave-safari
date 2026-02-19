-- Remove duplicate destinations (keep only the first occurrence)
DELETE FROM destinations WHERE id > 6;

-- Remove duplicate bookings if any
DELETE FROM bookings WHERE id > 3;

-- Remove duplicate enquiries if any
DELETE FROM enquiries WHERE id > 2;

-- Verify remaining records
SELECT COUNT(*) as destinations_remaining FROM destinations;
SELECT COUNT(*) as bookings_remaining FROM bookings;
SELECT COUNT(*) as enquiries_remaining FROM enquiries;
