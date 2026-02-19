import express from 'express';
import pool from '../config/db.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

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
    const { title, description, discount_text, button_text, button_link, active } = req.body;
    
    const result = await pool.query(
      'INSERT INTO promotions (title, description, discount_text, button_text, button_link, active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, discount_text, button_text, button_link, active !== false]
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
    const { title, description, discount_text, button_text, button_link, active } = req.body;
    
    const result = await pool.query(
      'UPDATE promotions SET title = $1, description = $2, discount_text = $3, button_text = $4, button_link = $5, active = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
      [title, description, discount_text, button_text, button_link, active, id]
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
