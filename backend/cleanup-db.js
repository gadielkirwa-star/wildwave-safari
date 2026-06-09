/**
 * Cleanup: removes duplicate destinations (keeps lowest id per normalized name)
 * and fixes the 7 "Unknown country" records by syncing country = category
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

console.log('\n🧹 WildWave — DB Cleanup\n');

// Step 1: Fix the 7 Unknown records — set country = category
const fixUnknown = await pool.query(`
  UPDATE destinations 
  SET country = category 
  WHERE country IS NULL AND category IS NOT NULL
  RETURNING name, country
`);
console.log(`✅ Fixed ${fixUnknown.rows.length} destinations with missing country:`);
fixUnknown.rows.forEach(r => console.log(`   - ${r.name} → ${r.country}`));

// Step 2: Remove duplicates — keep the lowest id for each normalized name
const dupResult = await pool.query(`
  DELETE FROM destinations
  WHERE id NOT IN (
    SELECT MIN(id)
    FROM destinations
    GROUP BY LOWER(TRIM(name))
  )
  RETURNING id, name
`);
console.log(`\n✅ Removed ${dupResult.rows.length} duplicate destinations:`);
dupResult.rows.forEach(r => console.log(`   - [${r.id}] ${r.name}`));

// Step 3: Final count
const final = await pool.query(`
  SELECT country, COUNT(*) as count 
  FROM destinations 
  GROUP BY country 
  ORDER BY country
`);
console.log('\n📊 Final destination counts by country:');
let total = 0;
final.rows.forEach(r => {
  console.log(`   ${r.country || 'Unknown'}: ${r.count}`);
  total += parseInt(r.count);
});
console.log(`   TOTAL: ${total}\n`);

await pool.end();
console.log('✅ Cleanup complete!\n');
