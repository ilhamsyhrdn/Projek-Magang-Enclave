import { NextRequest, NextResponse } from 'next/server';
import { queryWithTenant } from '@/lib/db';
import { hashPassword, isPasswordHashEnabled, generateRandomPassword } from '@/lib/password';
import { getTenantFromRequest } from '@/lib/server-auth';

export async function GET(request: NextRequest) {
  try {
    const tenantName = await getTenantFromRequest(request);
    if (!tenantName) {
      return NextResponse.json({ message: 'Unauthorized: Tenant not found' }, { status: 401 });
    }

    const users = await queryWithTenant(
      tenantName,
      `
        SELECT
          u.id,
          u.employee_id,
          u.full_name,
          u.email,
          u.division_id,
          u.department_id,
          u.position_id,
          u.role,
          u.tenant_name,
          u.is_active,
          d.name as division_name,
          dep.name as department_name,
          p.name as position_name
        FROM users u
        LEFT JOIN divisions d ON u.division_id = d.id
        LEFT JOIN departments dep ON u.department_id = dep.id
        LEFT JOIN positions p ON u.position_id = p.id
        WHERE u.tenant_name = $1
        ORDER BY u.created_at ASC
      `,
      [tenantName]
    );

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ message: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const tenantName = await getTenantFromRequest(request);
    if (!tenantName) {
      return NextResponse.json({ message: 'Unauthorized: Tenant not found' }, { status: 401 });
    }

    const { employee_id, full_name, email, password_hash, division_id, department_id, position_id, role } = await request.json();

    console.log('[Create User] Password hashing:', isPasswordHashEnabled() ? 'enabled' : 'disabled');

    // Auto-generate password jika tidak disediakan
    const password = password_hash || generateRandomPassword(12);

    // Hash password jika production mode
    let passwordToSave = password;
    if (isPasswordHashEnabled()) {
      console.log('[Create User] Hashing password...');
      passwordToSave = await hashPassword(password);
    } else {
      console.log('[Create User] Saving password as plain text (dev mode)');
    }

    // Validasi required fields
    if (!employee_id || !full_name || !email || !passwordToSave || !position_id || !role) {
      return NextResponse.json({ message: 'Field wajib diisi: ID Pegawai, Nama Lengkap, Email, Password, Jabatan, dan Role' }, { status: 400 });
    }

    const existingUser = await queryWithTenant(
      tenantName,
      'SELECT id FROM users WHERE email = $1 AND tenant_name = $2',
      [email, tenantName]
    );

    if (existingUser.length > 0) {
      return NextResponse.json({ message: 'Email already exists' }, { status: 409 });
    }

    const existingEmployeeId = await queryWithTenant(
      tenantName,
      'SELECT id FROM users WHERE employee_id = $1 AND tenant_name = $2',
      [employee_id, tenantName]
    );

    if (existingEmployeeId.length > 0) {
      return NextResponse.json({ message: 'Employee ID already exists' }, { status: 409 });
    }

    // Gunakan nilai yang sudah diproses ke database
    const divisionIdValue = division_id ? division_id : null;
    const departmentIdValue = department_id ? department_id : null;
    const positionIdValue = position_id ? position_id : null;

    const result = await queryWithTenant(
      tenantName,
      `INSERT INTO users
        (employee_id, full_name, email, password_hash, division_id, department_id, position_id, role, tenant_name)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [employee_id, full_name, email, passwordToSave, divisionIdValue, departmentIdValue, positionIdValue, role, tenantName]
    );

    console.log('[Create User] User created successfully:', {
      email,
      employee_id,
      role,
      tenant: tenantName,
    });

    return NextResponse.json({ message: 'User created successfully', user: result[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ message: 'Failed to create user' }, { status: 500 });
  }
}
