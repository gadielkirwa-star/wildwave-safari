import pool from './config/db.js';
import dotenv from 'dotenv';
dotenv.config();

const parseItineraryText = (text) => {
  if (!text || typeof text !== 'string') return [];
  
  let lines = [];
  if (text.includes('|') || text.includes('\n')) {
    lines = text.split(/[|\n]+/).map(line => line.trim()).filter(Boolean);
  } else {
    // Split by position before word "Day" (lookahead match)
    lines = text.split(/(?=\bDay\b)/i).map(line => line.trim()).filter(Boolean);
    // Remove trailing period from each line
    lines = lines.map(line => line.replace(/\.+$/, '').trim());
  }
  
  return lines.map((line, index) => {
    // Matches "Day 1:", "Day 1-2:", "Day 1 -", "Day 1", etc.
    const dayMatch = line.match(/^Day\s*([\d\-\s–to]+)[:.-]?\s*(.*)$/i);
    let dayStr = String(index + 1);
    let rest = line;
    
    if (dayMatch) {
      dayStr = dayMatch[1].trim();
      rest = dayMatch[2].trim();
    }
    
    // Now split the rest by first "-" or ":" to separate title and description
    let title = rest;
    let description = '';
    
    const separatorMatch = rest.match(/^(.*?)\s*(?:[\–\-\—]\s+|\s+[\–\-\—]|\s*[:]\s*)(.*)$/);
    if (separatorMatch) {
      title = separatorMatch[1].trim();
      description = separatorMatch[2].trim();
    }
    
    // Ensure day is numeric if possible, otherwise extract first number or use index
    let dayNum = parseInt(dayStr, 10);
    if (isNaN(dayNum)) {
      dayNum = index + 1;
    }
    
    return {
      day: dayNum,
      title: title || `Day ${dayStr} Activities`,
      description: description || title || rest
    };
  });
};

async function migrate() {
  try {
    console.log('Querying all packages...');
    const result = await pool.query('SELECT id, name, itinerary FROM packages');
    console.log(`Found ${result.rows.length} packages.`);
    
    for (const row of result.rows) {
      const parsed = parseItineraryText(row.itinerary);
      console.log(`Package ID ${row.id} ("${row.name}"): parsed ${parsed.length} days.`);
      await pool.query(
        'UPDATE packages SET itinerary_json = $1 WHERE id = $2',
        [JSON.stringify(parsed), row.id]
      );
    }
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await pool.end();
  }
}

migrate();
