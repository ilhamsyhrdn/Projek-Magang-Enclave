import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { queryWithTenant } from '@/lib/db';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized - Token not found' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);

    // HARDCODED TEST ACCOUNTS VERIFICATION
    const testAccounts = [
      { userId: 0, email: 'superadmin@superadmin.com', role: 'superadmin', name: 'Super Administrator', tenantName: 'superadmin', employeeId: 'SUPERADMIN' },
      { userId: 1001, email: 'himatif@admin.com', role: 'admin', name: 'Admin Himatif', tenantName: 'himatif', employeeId: 'ADM001' },
      { userId: 2001, email: 'ilham@mail.com', role: 'approver', name: 'Ilham', tenantName: 'himatif', employeeId: 'APP001' },
      { userId: 2002, email: 'rayhan@mail.com', role: 'approver', name: 'Rayhan', tenantName: 'himatif', employeeId: 'APP002' },
      { userId: 2003, email: 'candra@mail.com', role: 'approver', name: 'Candra', tenantName: 'himatif', employeeId: 'APP003' },
      { userId: 2004, email: 'direktur@mail.com', role: 'direktur', name: 'Direktur', tenantName: 'himatif', employeeId: 'DIR001' },
      { userId: 3001, email: 'pegawai@mail.com', role: 'general', name: 'Pegawai', tenantName: 'himatif', employeeId: 'EMP001' },
      { userId: 4001, email: 'adk@mail.com', role: 'adk', name: 'ADK User', tenantName: 'himatif', employeeId: 'ADK001' },
    ];

    const testAccount = testAccounts.find(acc => acc.email === payload.email);

    if (testAccount) {
      return NextResponse.json({
        success: true,
        user: {
          id: testAccount.userId,
          email: testAccount.email,
          fullName: testAccount.name,
          tenantName: testAccount.tenantName,
          role: testAccount.role,
          employeeId: testAccount.employeeId,
        },
      });
    }

    if (payload.role === 'superadmin' && payload.userId === 0) {
      return NextResponse.json({
        success: true,
        user: {
          id: 0,
          email: payload.email,
          fullName: 'Super Administrator',
          tenantName: 'superadmin',
          role: 'superadmin',
          employeeId: 'SUPERADMIN',
        },
      });
    }

    let user = null;

    if (payload.role === 'admin') {
      const adminResult = await pool.query(
        'SELECT id, name, email, tenant_name, role FROM superadmin.admins WHERE id = $1 AND is_active = true',
        [payload.userId]
      );

      if (adminResult.rows.length > 0) {
        user = adminResult.rows[0];
        return NextResponse.json({
          success: true,
          user: {
            id: user.id,
            email: user.email,
            fullName: user.name,
            tenantName: user.tenant_name,
            role: user.role,
            employeeId: '',
          },
        });
      }
    }

    const users = await queryWithTenant(
      payload.tenantName,
      `SELECT id, email, full_name, tenant_name, role, employee_id, division_id, department_id, position_id
       FROM users WHERE id = $1 AND is_active = true`,
      [payload.userId]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    user = users[0];

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        tenantName: user.tenant_name,
        role: user.role,
        employeeId: user.employee_id,
        divisionId: user.division_id,
        departmentId: user.department_id,
        positionId: user.position_id,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { message: 'Unauthorized - Invalid token' },
      { status: 401 }
    );
  }
}