// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { queryWithTenant } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);

    // Get latest user data
    const users = await queryWithTenant(payload.tenantName,
      'SELECT id, email, full_name, tenant_name, role, employee_id FROM users WHERE id = $1',
      [payload.userId]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: users[0].id,
        email: users[0].email,
        fullName: users[0].full_name,
        tenantName: users[0].tenant_name,
        role: users[0].role,
        employeeId: users[0].employee_id,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }
}
