import { NextRequest, NextResponse } from 'next/server';
import { queryWithTenant } from '@/lib/db';
import { signToken, signRefreshToken } from '@/lib/jwt';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email dan password harus diisi' },
        { status: 400 }
      );
    }

    // SUPERADMIN HARDCODED
    if (email === 'superadmin@superadmin.com' && password === 'superadmin') {
      const accessToken = signToken({
        userId: 0,
        email: email,
        tenantName: 'superadmin',
        role: 'superadmin',
        employeeId: 'SUPERADMIN',
      });

      const refreshToken = signRefreshToken({
        userId: 0,
        email: email,
        tenantName: 'superadmin',
        role: 'superadmin',
        employeeId: 'SUPERADMIN',
      });

      const response = NextResponse.json({
        success: true,
        message: 'Login berhasil',
        user: {
          id: 0,
          email: email,
          fullName: 'Super Administrator',
          tenantName: 'superadmin',
          role: 'superadmin',
          employeeId: 'SUPERADMIN',
        },
        redirectTo: '/dashboard-superadmin',
      });

      response.cookies.set('token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 1, 
        path: '/',
      });

      response.cookies.set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 3,
        path: '/',
      });

      return response;
    }

    let user = null;
    let isAdmin = false;

    try {
      const adminResult = await pool.query(
        'SELECT * FROM superadmin.admins WHERE email = $1 AND is_active = true',
        [email]
      );

      if (adminResult.rows.length > 0) {
        user = adminResult.rows[0];
        isAdmin = true;
      }
    } catch (error) {
      console.error('Error checking admin:', error);
    }

    if (!user) {
      const tenantsResult = await pool.query(
        'SELECT DISTINCT tenant_name FROM superadmin.admins WHERE is_active = true'
      );
      
      const tenants = tenantsResult.rows.map(row => row.tenant_name);

      for (const tenantName of tenants) {
        try {
          const users = await queryWithTenant(
            tenantName,
            'SELECT * FROM users WHERE email = $1 AND is_active = true',
            [email]
          );

          if (users.length > 0) {
            user = users[0];
            break;
          }
        } catch (error) {
          console.error(`Error checking tenant ${tenantName}:`, error);
        }
      }
    }

    if (!user) {
      return NextResponse.json(
        { message: 'Email atau Password yang dimasukan salah, silahkan coba lagi' },
        { status: 401 }
      );
    }

    const passwordField = isAdmin ? user.password : user.password_hash;
    
    if (passwordField !== password) {
      return NextResponse.json(
        { message: 'Email atau Password yang dimasukan salah, silahkan coba lagi' },
        { status: 401 }
      );
    }

    if (!isAdmin && user.tenant_name) {
      try {
        await queryWithTenant(
          user.tenant_name,
          'UPDATE users SET last_login = NOW() WHERE id = $1',
          [user.id]
        );
      } catch (error) {
        console.error('Error updating last login:', error);
      }
    }

    let redirectPath = '/user/beranda';
    const userRole = user.role;

    if (isAdmin) {
      redirectPath = '/admin/beranda';
    } else {
      if (userRole === 'approver' || userRole === 'secretary') {
        redirectPath = '/approver/beranda';
      } else if (userRole === 'general') {
        redirectPath = '/user/beranda';
      } else {
        redirectPath = '/user/beranda';
      }
    }

    const accessToken = signToken({
      userId: user.id,
      email: user.email,
      tenantName: isAdmin ? user.tenant_name : user.tenant_name,
      role: userRole,
      employeeId: isAdmin ? '' : (user.employee_id || ''),
    });

    const refreshToken = signRefreshToken({
      userId: user.id,
      email: user.email,
      tenantName: isAdmin ? user.tenant_name : user.tenant_name,
      role: userRole,
      employeeId: isAdmin ? '' : (user.employee_id || ''),
    });

    const userData = {
      id: user.id,
      email: user.email,
      fullName: isAdmin ? user.name : user.full_name,
      tenantName: user.tenant_name,
      role: userRole,
      employeeId: isAdmin ? '' : (user.employee_id || ''),
    };

    const response = NextResponse.json({
      success: true,
      message: 'Login berhasil',
      user: userData,
      redirectTo: redirectPath,
    });

    response.cookies.set('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1,
      path: '/',
    });

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 3,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan server, silahkan coba lagi' },
      { status: 500 }
    );
  }
}