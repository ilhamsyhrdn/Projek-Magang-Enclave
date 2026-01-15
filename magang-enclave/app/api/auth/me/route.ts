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