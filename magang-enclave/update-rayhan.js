import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'eoffice_db',
  user: 'postgres',
  password: '1964',
});

async function updateRayhanRole() {
  try {
    console.log('Updating Rayhan role from secretary to approver...');
    
    const result = await pool.query(`
      UPDATE himatif.users 
      SET role = 'approver', 
          updated_at = CURRENT_TIMESTAMP 
      WHERE email = 'rayhan@mail.com'
      RETURNING id, employee_id, full_name, email, role, is_active;
    `);

    if (result.rows.length > 0) {
      console.log('✓ Update successful!');
      console.log('Updated user:', result.rows[0]);
    } else {
      console.log('✗ No user found with email rayhan@mail.com');
    }
  } catch (error) {
    console.error('Error updating role:', error);
  } finally {
    await pool.end();
  }
}

updateRayhanRole();
