import pg from 'pg';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '.env') });
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

// Find the empty-country record
const r1 = await pool.query(`SELECT id, name, country, category FROM destinations WHERE country = '' OR country IS NULL`);
console.log('Records with empty/null country:', r1.rows);

// Fix: set country = category for these
const r2 = await pool.query(`
  UPDATE destinations SET country = category WHERE (country IS NULL OR country = '') AND category IS NOT NULL
  RETURNING id, name, country
`);
console.log('Fixed:', r2.rows);

// If still nothing, check what the remaining unknown is
const r3 = await pool.query(`SELECT id, name, country, category FROM destinations WHERE country NOT IN ('Kenya','Tanzania','Uganda','Rwanda') OR country IS NULL`);
console.log('Remaining non-standard countries:', r3.rows);

await pool.end();
