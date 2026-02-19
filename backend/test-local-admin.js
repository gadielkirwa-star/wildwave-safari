import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: 'postgresql://wildwave_user:wildwave_pass@localhost:5432/wildwave_safaris'
});

async function checkAdmin() {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role FROM users WHERE email = $1', 
      ['admin@wildwavesafaris.com']
    );
    
    if (result.rows.length === 0) {
      console.log('❌ Admin user NOT found in local database');
      console.log('\nInserting admin user...');
      
      const insertResult = await pool.query(
        "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, email, role",
        ['Admin User', 'admin@wildwavesafaris.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIeWEHaSuu', 'admin']
      );
      console.log('✅ Admin user created!');
      console.table(insertResult.rows);
    } else {
      console.log('✅ Admin user found!');
      console.table(result.rows);
    }
    
    await pool.end();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkAdmin();
