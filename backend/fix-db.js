/**
 * Final fix: sets country=category for any remaining records where country is null
 * and removes the last lone duplicate (Masai mara / Masai Mara)
 */
import pg from 'pg';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '.env') });

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Fix any remaining NULL country rows
const fix1 = await pool.query(`
  UPDATE destinations 
  SET country = category 
  WHERE (country IS NULL OR country = 'Unknown') AND category IS NOT NULL
  RETURNING id, name, category
`);
console.log(`Fixed ${fix1.rows.length} rows with missing country`);
fix1.rows.forEach(r => console.log(`  [${r.id}] ${r.name} → ${r.category}`));

// Final dedup pass
const fix2 = await pool.query(`
  DELETE FROM destinations
  WHERE id NOT IN (
    SELECT MIN(id) FROM destinations GROUP BY LOWER(REGEXP_REPLACE(TRIM(name), '\\s+', ' ', 'g'))
  )
  RETURNING id, name
`);
console.log(`\nRemoved ${fix2.rows.length} additional duplicates`);
fix2.rows.forEach(r => console.log(`  [${r.id}] ${r.name}`));

// Ensure ALL destinations have category=country
await pool.query(`
  UPDATE destinations 
  SET category = country 
  WHERE category IS NULL AND country IS NOT NULL
`);

// Final count
const count = await pool.query('SELECT country, COUNT(*) FROM destinations GROUP BY country ORDER BY country');
let total = 0;
console.log('\n📊 Final state:');
count.rows.forEach(r => { console.log(`  ${r.country}: ${r.count}`); total += parseInt(r.count); });
console.log(`  TOTAL: ${total}`);

await pool.end();
