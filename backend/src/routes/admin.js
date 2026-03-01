import express from 'express';
import pool from '../config/db.js';
import { authenticate } from '../middleware/authenticate.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, '../../uploads');

fs.mkdirSync(uploadsDir, { recursive: true });

const ensureTeamMembersTable = async () => {
  await pool.query(`
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
    )
  `);

  await pool.query('ALTER TABLE team_members ADD COLUMN IF NOT EXISTS role VARCHAR(255)');
  await pool.query('ALTER TABLE team_members ADD COLUMN IF NOT EXISTS bio TEXT');
  await pool.query('ALTER TABLE team_members ADD COLUMN IF NOT EXISTS image_url TEXT');
  await pool.query('ALTER TABLE team_members ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true');
  await pool.query('ALTER TABLE team_members ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0');
};

const withTeamMembersTable = async (operation) => {
  try {
    return await operation();
  } catch (error) {
    // Self-heal older databases that haven't received team_members migrations yet.
    if (error?.code !== '42P01' && error?.code !== '42703') {
      throw error;
    }
    await ensureTeamMembersTable();
    return operation();
  }
};

const ensurePromotionImageColumns = async () => {
  await pool.query('ALTER TABLE promotions ADD COLUMN IF NOT EXISTS info_text TEXT');
  await pool.query('ALTER TABLE promotions ADD COLUMN IF NOT EXISTS image_url TEXT');
};

const withPromotionImageColumns = async (operation) => {
  try {
    return await operation();
  } catch (error) {
    // Self-heal older databases that do not yet have promotion image/info columns.
    if (error?.code !== '42703' && error?.code !== '42P01') {
      throw error;
    }
    await ensurePromotionImageColumns();
    return operation();
  }
};

const syncDestinationImageByPackageName = async (name, imageUrl) => {
  if (!name || !imageUrl) return 0;

  const result = await pool.query(
    `UPDATE destinations
     SET image_url = $1
     WHERE LOWER(TRIM(name)) = LOWER(TRIM($2))`,
    [imageUrl, name]
  );

  return result.rowCount || 0;
};

router.post('/upload-image', authenticate, async (req, res) => {
  try {
    const { imageBase64, filename } = req.body || {};

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ error: 'No image payload provided' });
    }

    const dataUrlMatch = imageBase64.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
    const rawBase64 = dataUrlMatch ? dataUrlMatch[2] : imageBase64;
    const mimeType = dataUrlMatch ? dataUrlMatch[1] : '';

    const mimeToExt = {
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
      'image/gif': '.gif',
      'image/avif': '.avif',
    };

    const requestedExt = path.extname(String(filename || '')).toLowerCase();
    const ext =
      mimeToExt[mimeType] ||
      (['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'].includes(requestedExt) ? requestedExt : '.jpg');

    const buffer = Buffer.from(rawBase64, 'base64');
    if (!buffer.length) {
      return res.status(400).json({ error: 'Invalid image payload' });
    }
    if (buffer.length > 8 * 1024 * 1024) {
      return res.status(400).json({ error: 'Image too large. Maximum size is 8MB' });
    }

    const safeFilename = `img-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const fullPath = path.join(uploadsDir, safeFilename);
    await fs.promises.writeFile(fullPath, buffer);

    const urlPath = `/uploads/${safeFilename}`;
    const absoluteUrl = `${req.protocol}://${req.get('host')}${urlPath}`;

    return res.json({
      url: absoluteUrl,
      path: urlPath,
      filename: safeFilename,
    });
  } catch (error) {
    console.error('Image upload error:', error);
    return res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Dashboard statistics
router.get('/dashboard', authenticate, async (req, res) => {
  try {
    const bookingsCount = await pool.query('SELECT COUNT(*) FROM bookings');
    const revenueSum = await pool.query('SELECT SUM(total_price) FROM bookings WHERE status = $1', ['confirmed']);
    const customersCount = await pool.query('SELECT COUNT(DISTINCT email) FROM bookings');
    const activeToursCount = await pool.query('SELECT COUNT(*) FROM bookings WHERE status = $1', ['confirmed']);

    const recentBookings = await pool.query(
      'SELECT * FROM bookings ORDER BY created_at DESC LIMIT 5'
    );

    const countryData = await pool.query(`
      SELECT safari_type as country, COUNT(*) as bookings 
      FROM bookings 
      GROUP BY safari_type
    `);

    const revenueData = await pool.query(`
      SELECT TO_CHAR(created_at, 'Mon') as month, SUM(total_price) as revenue
      FROM bookings
      WHERE created_at >= NOW() - INTERVAL '6 months'
      GROUP BY TO_CHAR(created_at, 'Mon'), EXTRACT(MONTH FROM created_at)
      ORDER BY EXTRACT(MONTH FROM created_at)
    `);

    res.json({
      totalBookings: parseInt(bookingsCount.rows[0].count),
      totalRevenue: parseFloat(revenueSum.rows[0].sum || 0),
      totalCustomers: parseInt(customersCount.rows[0].count),
      activeTours: parseInt(activeToursCount.rows[0].count),
      bookingGrowth: 12.5,
      revenueGrowth: 18.3,
      recentBookings: recentBookings.rows,
      countryData: countryData.rows.map(row => ({
        country: row.country,
        bookings: parseInt(row.bookings),
        percentage: 0
      })),
      revenueData: revenueData.rows
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Bookings
router.get('/bookings', authenticate, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bookings ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

router.put('/bookings/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const result = await pool.query(
      'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

// Destinations
router.get('/destinations', authenticate, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM destinations ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Destinations error:', error);
    res.status(500).json({ error: 'Failed to fetch destinations' });
  }
});

router.post('/destinations', authenticate, async (req, res) => {
  try {
    const { name, description, price, duration, image_url, category, country, tags, best_months } = req.body;
    
    const result = await pool.query(
      'INSERT INTO destinations (name, description, price, duration, image_url, category, country, tags, best_months) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [name, description, price, duration, image_url, category, country, tags, best_months]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Create destination error:', error);
    res.status(500).json({ error: 'Failed to create destination' });
  }
});

router.put('/destinations/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, duration, image_url, category, country, tags, best_months } = req.body;
    
    const result = await pool.query(
      'UPDATE destinations SET name = $1, description = $2, price = $3, duration = $4, image_url = $5, category = $6, country = $7, tags = $8, best_months = $9 WHERE id = $10 RETURNING *',
      [name, description, price, duration, image_url, category, country, tags, best_months, id]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update destination error:', error);
    res.status(500).json({ error: 'Failed to update destination' });
  }
});

router.delete('/destinations/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM destinations WHERE id = $1', [id]);
    res.json({ message: 'Destination deleted' });
  } catch (error) {
    console.error('Delete destination error:', error);
    res.status(500).json({ error: 'Failed to delete destination' });
  }
});

// Enquiries
router.get('/enquiries', authenticate, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM enquiries ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Enquiries error:', error);
    res.status(500).json({ error: 'Failed to fetch enquiries' });
  }
});

router.put('/enquiries/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const result = await pool.query(
      'UPDATE enquiries SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update enquiry error:', error);
    res.status(500).json({ error: 'Failed to update enquiry' });
  }
});

// Blogs
router.get('/blogs', authenticate, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM blogs ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Blogs error:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

router.post('/blogs', authenticate, async (req, res) => {
  try {
    const { title, category, excerpt, content, image_url, read_time, published } = req.body;
    
    const result = await pool.query(
      'INSERT INTO blogs (title, category, excerpt, content, image_url, read_time, published) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, category, excerpt, content, image_url, read_time, published !== false]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ error: 'Failed to create blog' });
  }
});

router.put('/blogs/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, excerpt, content, image_url, read_time, published } = req.body;
    
    const result = await pool.query(
      'UPDATE blogs SET title = $1, category = $2, excerpt = $3, content = $4, image_url = $5, read_time = $6, published = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $8 RETURNING *',
      [title, category, excerpt, content, image_url, read_time, published, id]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ error: 'Failed to update blog' });
  }
});

router.delete('/blogs/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM blogs WHERE id = $1', [id]);
    res.json({ message: 'Blog deleted' });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ error: 'Failed to delete blog' });
  }
});

// Contact Settings
router.get('/contact-settings', authenticate, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contact_settings LIMIT 1');
    res.json(result.rows[0] || {});
  } catch (error) {
    console.error('Contact settings error:', error);
    res.status(500).json({ error: 'Failed to fetch contact settings' });
  }
});

router.put('/contact-settings', authenticate, async (req, res) => {
  try {
    const { phone, email, whatsapp, address, office_hours } = req.body;
    
    const result = await pool.query(
      'UPDATE contact_settings SET phone = $1, email = $2, whatsapp = $3, address = $4, office_hours = $5, updated_at = CURRENT_TIMESTAMP WHERE id = 1 RETURNING *',
      [phone, email, whatsapp, address, office_hours]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update contact settings error:', error);
    res.status(500).json({ error: 'Failed to update contact settings' });
  }
});

// Packages
router.get('/packages', authenticate, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM packages ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Packages error:', error);
    res.status(500).json({ error: 'Failed to fetch packages' });
  }
});

router.post('/packages', authenticate, async (req, res) => {
  try {
    const { name, duration, price, tag, type, image_url, description, itinerary, includes, excludes, published } = req.body;
    
    const result = await pool.query(
      'INSERT INTO packages (name, duration, price, tag, type, image_url, description, itinerary, includes, excludes, published) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [name, duration, price, tag, type, image_url, description, itinerary, includes, excludes, published !== false]
    );

    // Keep public destinations in sync when package name matches destination name.
    await syncDestinationImageByPackageName(name, image_url);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Create package error:', error);
    res.status(500).json({ error: 'Failed to create package' });
  }
});

router.put('/packages/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, duration, price, tag, type, image_url, description, itinerary, includes, excludes, published } = req.body;
    
    const result = await pool.query(
      'UPDATE packages SET name = $1, duration = $2, price = $3, tag = $4, type = $5, image_url = $6, description = $7, itinerary = $8, includes = $9, excludes = $10, published = $11 WHERE id = $12 RETURNING *',
      [name, duration, price, tag, type, image_url, description, itinerary, includes, excludes, published, id]
    );

    if (result.rows[0]) {
      // Keep public destinations in sync when package name matches destination name.
      await syncDestinationImageByPackageName(result.rows[0].name, result.rows[0].image_url);
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update package error:', error);
    res.status(500).json({ error: 'Failed to update package' });
  }
});

router.delete('/packages/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM packages WHERE id = $1', [id]);
    res.json({ message: 'Package deleted' });
  } catch (error) {
    console.error('Delete package error:', error);
    res.status(500).json({ error: 'Failed to delete package' });
  }
});

// Sync package images to matching destinations by name
router.post('/packages/sync-destination-images', authenticate, async (req, res) => {
  try {
    const result = await pool.query(`
      WITH source AS (
        SELECT name, image_url
        FROM packages
        WHERE COALESCE(published, true) = true
          AND COALESCE(NULLIF(TRIM(image_url), ''), '') <> ''
      ),
      updated AS (
        UPDATE destinations d
        SET image_url = s.image_url
        FROM source s
        WHERE LOWER(TRIM(d.name)) = LOWER(TRIM(s.name))
        RETURNING LOWER(TRIM(d.name)) AS name_key
      )
      SELECT
        (SELECT COUNT(*) FROM source) AS source_count,
        (SELECT COUNT(*) FROM updated) AS updated_count,
        (
          SELECT COUNT(*)
          FROM source s
          WHERE NOT EXISTS (
            SELECT 1
            FROM updated u
            WHERE u.name_key = LOWER(TRIM(s.name))
          )
        ) AS unmatched_count
    `);

    const row = result.rows[0];
    res.json({
      sourceCount: Number(row.source_count || 0),
      updatedCount: Number(row.updated_count || 0),
      unmatchedCount: Number(row.unmatched_count || 0),
      message: 'Destination images synced from safari packages',
    });
  } catch (error) {
    console.error('Sync destination images error:', error);
    res.status(500).json({ error: 'Failed to sync destination images' });
  }
});

// Promotions
router.get('/promotions', authenticate, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM promotions ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Promotions error:', error);
    res.status(500).json({ error: 'Failed to fetch promotions' });
  }
});

router.post('/promotions', authenticate, async (req, res) => {
  try {
    const { title, description, info_text, image_url, discount_text, button_text, button_link, active } = req.body;

    const result = await withPromotionImageColumns(() =>
      pool.query(
        'INSERT INTO promotions (title, description, info_text, image_url, discount_text, button_text, button_link, active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        [title, description, info_text || null, image_url || null, discount_text, button_text, button_link, active !== false]
      )
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Create promotion error:', error);
    res.status(500).json({ error: 'Failed to create promotion' });
  }
});

router.put('/promotions/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, info_text, image_url, discount_text, button_text, button_link, active } = req.body;

    const result = await withPromotionImageColumns(() =>
      pool.query(
        'UPDATE promotions SET title = $1, description = $2, info_text = $3, image_url = $4, discount_text = $5, button_text = $6, button_link = $7, active = $8, updated_at = CURRENT_TIMESTAMP WHERE id = $9 RETURNING *',
        [title, description, info_text || null, image_url || null, discount_text, button_text, button_link, active, id]
      )
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update promotion error:', error);
    res.status(500).json({ error: 'Failed to update promotion' });
  }
});

router.delete('/promotions/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM promotions WHERE id = $1', [id]);
    res.json({ message: 'Promotion deleted' });
  } catch (error) {
    console.error('Delete promotion error:', error);
    res.status(500).json({ error: 'Failed to delete promotion' });
  }
});

// Team members
router.get('/team-members', authenticate, async (req, res) => {
  try {
    const result = await withTeamMembersTable(() =>
      pool.query(
        'SELECT * FROM team_members ORDER BY COALESCE(display_order, 0) ASC, created_at DESC, id DESC'
      )
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Team members error:', error);
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
});

router.post('/team-members', authenticate, async (req, res) => {
  try {
    const { name, role, bio, image_url, active, display_order } = req.body;

    const result = await withTeamMembersTable(() =>
      pool.query(
        `INSERT INTO team_members (name, role, bio, image_url, active, display_order)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          name,
          role || null,
          bio || null,
          image_url || null,
          active !== false,
          Number.isFinite(Number(display_order)) ? Number(display_order) : 0,
        ]
      )
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Create team member error:', error);
    res.status(500).json({ error: 'Failed to create team member' });
  }
});

router.put('/team-members/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, bio, image_url, active, display_order } = req.body;

    const result = await withTeamMembersTable(() =>
      pool.query(
        `UPDATE team_members
         SET name = $1,
             role = $2,
             bio = $3,
             image_url = $4,
             active = $5,
             display_order = $6,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $7
         RETURNING *`,
        [
          name,
          role || null,
          bio || null,
          image_url || null,
          active !== false,
          Number.isFinite(Number(display_order)) ? Number(display_order) : 0,
          id,
        ]
      )
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update team member error:', error);
    res.status(500).json({ error: 'Failed to update team member' });
  }
});

router.delete('/team-members/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    await withTeamMembersTable(() =>
      pool.query('DELETE FROM team_members WHERE id = $1', [id])
    );
    res.json({ message: 'Team member deleted' });
  } catch (error) {
    console.error('Delete team member error:', error);
    res.status(500).json({ error: 'Failed to delete team member' });
  }
});

// Admin Users
router.get('/users', authenticate, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.post('/users', authenticate, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const bcrypt = await import('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at',
      [name, email, hashedPassword, role || 'sub-admin']
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.delete('/users/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Customers
router.get('/customers', authenticate, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, phone, created_at FROM customers ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Customers error:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

export default router;
