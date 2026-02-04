import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'eoffice_db',
  user: 'postgres',
  password: '1964',
});

async function updateUserRole() {
  const userEmail = 'user@mail.com'; // sesuaikan email
  const newRole = 'approver'; // role: approver/adk/direktur/admin/general

  try {
    console.log(`Updating user role to ${newRole}...`);
    
    const result = await pool.query(`
      UPDATE himatif.users 
      SET role = $1, 
          updated_at = CURRENT_TIMESTAMP 
      WHERE email = $2
      RETURNING id, employee_id, full_name, email, role, is_active;
    `, [newRole, userEmail]);

    if (result.rows.length > 0) {
      console.log('Update berhasil!');
      console.log('User:', result.rows[0]);
    } else {
      console.log(`User tidak ditemukan: ${userEmail}`);
    }
  } catch (error) {
    console.error('Error updating role:', error);
  } finally {
    await pool.end();
  }
}

updateUserRole();
