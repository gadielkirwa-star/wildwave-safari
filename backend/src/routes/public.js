import express from 'express';
import { Readable } from 'stream';
import pool from '../config/db.js';

const router = express.Router();
const ALLOWED_VIDEO_HOSTS = new Set([
  'pixabay.com',
  'cdn.pixabay.com',
  'player.vimeo.com',
]);

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
    if (error?.code !== '42P01' && error?.code !== '42703') {
      throw error;
    }
    await ensureTeamMembersTable();
    return operation();
  }
};

router.get('/destinations', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM destinations WHERE COALESCE(published, true) = true ORDER BY created_at DESC, id DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Public destinations error:', error);
    res.status(500).json({ error: 'Failed to fetch destinations' });
  }
});

router.get('/destinations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM destinations WHERE id = $1 AND COALESCE(published, true) = true',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Public destination error:', error);
    res.status(500).json({ error: 'Failed to fetch destination' });
  }
});

router.post('/bookings', async (req, res) => {
  try {
    const { customer_name, email, phone, safari_type, number_of_people, start_date, total_price, special_requests } = req.body;

    let result;
    try {
      // Preferred insert path for current schema.
      result = await pool.query(
        'INSERT INTO bookings (customer_name, email, phone, safari_type, number_of_people, start_date, total_price, special_requests, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
        [customer_name, email, phone, safari_type, number_of_people, start_date, total_price, special_requests, 'pending']
      );
    } catch (insertError) {
      // Backward compatibility for older production schemas missing special_requests.
      if (insertError?.code !== '42703') {
        throw insertError;
      }

      result = await pool.query(
        'INSERT INTO bookings (customer_name, email, phone, safari_type, number_of_people, start_date, total_price, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        [customer_name, email, phone, safari_type, number_of_people, start_date, total_price, 'pending']
      );
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

router.post('/enquiries', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    const result = await pool.query(
      'INSERT INTO enquiries (name, email, phone, subject, message, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, email, phone, subject || null, message, 'new']
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Create enquiry error:', error);
    res.status(500).json({ error: 'Failed to create enquiry' });
  }
});

router.get('/blogs', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM blogs WHERE COALESCE(published, true) = true ORDER BY created_at DESC, id DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Public blogs error:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

router.get('/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM blogs WHERE id = $1 AND COALESCE(published, true) = true',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Public blog error:', error);
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
});

router.get('/contact-settings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contact_settings LIMIT 1');
    res.json(result.rows[0] || {});
  } catch (error) {
    console.error('Public contact settings error:', error);
    res.status(500).json({ error: 'Failed to fetch contact settings' });
  }
});

router.get('/packages', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM packages WHERE COALESCE(published, true) = true ORDER BY created_at DESC, id DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Public packages error:', error);
    res.status(500).json({ error: 'Failed to fetch packages' });
  }
});

router.get('/promotions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM promotions WHERE active = true ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Public promotions error:', error);
    res.status(500).json({ error: 'Failed to fetch promotions' });
  }
});

router.get('/team-members', async (req, res) => {
  try {
    const result = await withTeamMembersTable(() =>
      pool.query(
        `SELECT *
         FROM team_members
         WHERE COALESCE(active, true) = true
         ORDER BY COALESCE(display_order, 0) ASC, created_at DESC, id DESC`
      )
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Public team members error:', error);
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
});

router.get('/partners', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM partners WHERE COALESCE(is_active, true) = true ORDER BY COALESCE(display_order, 0) ASC, created_at DESC, id DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Public partners error:', error);
    res.status(500).json({ error: 'Failed to fetch partners' });
  }
});

router.get('/video-proxy', async (req, res) => {
  try {
    const rawUrl = `${req.query.url || ''}`.trim();
    if (!rawUrl) {
      return res.status(400).json({ error: 'Missing url query parameter' });
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(rawUrl);
    } catch {
      return res.status(400).json({ error: 'Invalid video URL' });
    }

    const protocolAllowed = parsedUrl.protocol === 'https:' || parsedUrl.protocol === 'http:';
    if (!protocolAllowed) {
      return res.status(400).json({ error: 'Unsupported URL protocol' });
    }

    if (!ALLOWED_VIDEO_HOSTS.has(parsedUrl.hostname)) {
      return res.status(400).json({ error: 'Video host is not allowed' });
    }

    const requestHeaders = {
      'User-Agent': 'Mozilla/5.0',
      Accept: 'video/*,*/*;q=0.8',
      Referer: 'https://pixabay.com/',
    };

    const range = req.headers.range;
    if (range) {
      requestHeaders.Range = range;
    }

    const upstream = await fetch(parsedUrl.toString(), { headers: requestHeaders });
    if (!upstream.ok && upstream.status !== 206) {
      return res.status(upstream.status).json({ error: 'Unable to fetch video source' });
    }

    const passthroughHeaders = [
      'content-type',
      'content-length',
      'content-range',
      'accept-ranges',
      'cache-control',
      'last-modified',
      'etag',
    ];

    passthroughHeaders.forEach((header) => {
      const value = upstream.headers.get(header);
      if (value) {
        res.setHeader(header, value);
      }
    });
    if (!upstream.headers.get('cache-control')) {
      res.setHeader('cache-control', 'public, max-age=3600');
    }

    res.status(upstream.status);

    if (!upstream.body) {
      return res.end();
    }

    Readable.fromWeb(upstream.body).pipe(res);
  } catch (error) {
    console.error('Public video proxy error:', error);
    res.status(500).json({ error: 'Failed to proxy video' });
  }
});

export default router;
