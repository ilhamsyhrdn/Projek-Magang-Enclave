import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'eoffice_db',
  user: 'postgres',
  password: '1964',
});

async function setupUsers() {
  try {
    console.log('=== Setting up users ===\n');
    
    // Insert Ilham - Approver
    const ilham = await pool.query(`
      INSERT INTO himatif.users 
      (employee_id, full_name, email, password_hash, role, tenant_name, is_active, created_at, updated_at)
      VALUES ('110001', 'Ilham', 'ilham@mail.com', 'ilham123', 'approver', 'himatif', true, NOW(), NOW())
      ON CONFLICT (email) DO UPDATE 
      SET role = 'approver', password_hash = 'ilham123', full_name = 'Ilham', employee_id = '110001'
      RETURNING id, employee_id, full_name, email, role;
    `);
    console.log('✓ Ilham (Approver):', ilham.rows[0]);

    // Insert Rayhan - Approver
    const rayhan = await pool.query(`
      INSERT INTO himatif.users 
      (employee_id, full_name, email, password_hash, role, tenant_name, is_active, created_at, updated_at)
      VALUES ('110002', 'Rayhan', 'rayhan@mail.com', 'rayhan123', 'approver', 'himatif', true, NOW(), NOW())
      ON CONFLICT (email) DO UPDATE 
      SET role = 'approver', password_hash = 'rayhan123', full_name = 'Rayhan', employee_id = '110002'
      RETURNING id, employee_id, full_name, email, role;
    `);
    console.log('✓ Rayhan (Approver):', rayhan.rows[0]);

    // Insert Candra - Approver
    const candra = await pool.query(`
      INSERT INTO himatif.users 
      (employee_id, full_name, email, password_hash, role, tenant_name, is_active, created_at, updated_at)
      VALUES ('110003', 'Candra', 'candra@mail.com', 'candra123', 'approver', 'himatif', true, NOW(), NOW())
      ON CONFLICT (email) DO UPDATE 
      SET role = 'approver', password_hash = 'candra123', full_name = 'Candra', employee_id = '110003'
      RETURNING id, employee_id, full_name, email, role;
    `);
    console.log('✓ Candra (Approver):', candra.rows[0]);

    // Insert Pegawai - General
    const pegawai = await pool.query(`
      INSERT INTO himatif.users 
      (employee_id, full_name, email, password_hash, role, tenant_name, is_active, created_at, updated_at)
      VALUES ('110005', 'Pegawai 1', 'pegawai@mail.com', 'pegawai123', 'general', 'himatif', true, NOW(), NOW())
      ON CONFLICT (email) DO UPDATE 
      SET role = 'general', password_hash = 'pegawai123', full_name = 'Pegawai 1', employee_id = '110005'
      RETURNING id, employee_id, full_name, email, role;
    `);
    console.log('✓ Pegawai (General):', pegawai.rows[0]);

    console.log('\n=== All users created/updated successfully! ===');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

setupUsers();
