#!/bin/bash

# FIX-IMAGES.sh
# This script fixes image URLs that are stored as data URIs in the database

echo "🔧 FIXING IMAGE URLs IN DATABASE"
echo "=================================="
echo ""

# Find packages with data URIs (starting with 'data:')
echo "1. Finding broken image URLs (data: URIs)..."
echo ""

# To identify problematic records:
echo "Run this SQL to see which packages have data URIs:"
echo ""
echo "SELECT id, name, substring(image_url, 1, 100) AS image_preview"
echo "FROM packages"
echo "WHERE image_url LIKE 'data:%'"
echo "LIMIT 20;"
echo ""

echo "2. To fix them, update to valid Unsplash URLs:"
echo ""
echo "UPDATE packages SET image_url = 'https://images.unsplash.com/photo-1516426122078-c23e76319801' WHERE image_url LIKE 'data:%';"
echo ""

echo "3. For proper fix, use specific URLs per package type:"
echo ""
cat << 'EOF'
-- Kenya Wildlife
UPDATE packages SET image_url = 'https://images.unsplash.com/photo-1516426122078-c23e76319801' 
WHERE category = 'Kenya' AND name LIKE '%Masai%';

UPDATE packages SET image_url = 'https://images.unsplash.com/photo-1549366021-9f761d450615'
WHERE category = 'Kenya' AND name LIKE '%Amboseli%';

UPDATE packages SET image_url = 'https://images.unsplash.com/photo-1516426122078-c23e76319801'
WHERE category = 'Kenya' AND name LIKE '%Safari%' AND image_url LIKE 'data:%';

-- Tanzania
UPDATE packages SET image_url = 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e'
WHERE category = 'Tanzania' AND name LIKE '%Serengeti%';

UPDATE packages SET image_url = 'https://images.unsplash.com/photo-1535083783855-76ae62b2914e'
WHERE category = 'Tanzania' AND name LIKE '%Ngorongoro%';

UPDATE packages SET image_url = 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f'
WHERE category = 'Tanzania' AND name LIKE '%Zanzibar%';

-- Uganda Gorillas
UPDATE packages SET image_url = 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44'
WHERE category = 'Uganda' AND name LIKE '%Gorilla%';

UPDATE packages SET image_url = 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44'
WHERE category = 'Uganda' AND name LIKE '%Bwindi%';

-- Rwanda
UPDATE packages SET image_url = 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44'
WHERE category = 'Rwanda' AND name LIKE '%Mountain%';

UPDATE packages SET image_url = 'https://images.unsplash.com/photo-1535083783855-76ae62b2914e'
WHERE category = 'Rwanda' AND name LIKE '%Volcanoes%';

-- Generic fallback for any remaining
UPDATE packages SET image_url = 'https://images.unsplash.com/photo-1516426122078-c23e76319801'
WHERE image_url LIKE 'data:%';
EOF

echo ""
echo "4. Run these commands using psql on Render:"
echo ""
echo "PGPASSWORD=sS7IqFCVWjmL6uJETfEbRSm0OZtXGAlD psql -h dpg-d6baset6ubrc73cg59b0-a.oregon-postgres.render.com -U wildwave_user -d wildwave_safaris -c \"Your SQL here\""
echo ""

echo "✅ After updating, all packages will show proper Unsplash images"
