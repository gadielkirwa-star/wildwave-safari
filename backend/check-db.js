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

const r = await pool.query('SELECT id, name, country, category FROM destinations ORDER BY country, name');
console.log(`\nTotal destinations in DB: ${r.rows.length}\n`);
const grouped = {};
r.rows.forEach(d => {
  const key = d.country || 'Unknown';
  if (!grouped[key]) grouped[key] = [];
  grouped[key].push({ id: d.id, name: d.name, category: d.category });
});
Object.entries(grouped).forEach(([country, dests]) => {
  console.log(`\n🌍 ${country} (${dests.length} destinations):`);
  dests.forEach(d => console.log(`   [${d.id}] ${d.name} | category: ${d.category}`));
});
await pool.end();
