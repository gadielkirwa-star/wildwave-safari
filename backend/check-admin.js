import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://wildwave_user:wildwave_pass@localhost:5432/wildwave_safaris',
  ssl: { rejectUnauthorized: false }
});

async function checkAdmin() {
  try {
    console.log('Checking for admin users...');
    const result = await pool.query('SELECT id, name, email, role FROM users;');
    console.log('Users in database:');
    console.table(result.rows);
    
    console.log('\n\nChecking if admin@wildwave.com exists...');
    const adminResult = await pool.query('SELECT id, name, email, role FROM users WHERE email = $1', ['admin@wildwave.com']);
    if (adminResult.rows.length === 0) {
      console.log('❌ admin@wildwave.com does NOT exist in database');
    } else {
      console.log('✓ admin@wildwave.com EXISTS');
      console.table(adminResult.rows);
    }
    
    await pool.end();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkAdmin();
