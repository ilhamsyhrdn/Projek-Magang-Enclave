import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'eoffice_db',
  user: 'postgres',
  password: '1964',
});

async function checkDatabase() {
  try {
    console.log('=== Checking Admins Table ===');
    const admins = await pool.query(`
      SELECT id, name, email, role, tenant_name, is_active 
      FROM superadmin.admins 
      ORDER BY id;
    `);
    console.log('Admins:', admins.rows);

    console.log('\n=== Checking Himatif Users Table ===');
    const users = await pool.query(`
      SELECT id, employee_id, full_name, email, role, tenant_name, is_active 
      FROM himatif.users 
      ORDER BY id;
    `);
    console.log('Users:', users.rows);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkDatabase();
