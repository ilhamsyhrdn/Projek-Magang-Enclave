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

    // HARDCODED TEST ACCOUNTS
    const testAccounts = [
      // Superadmin
      { userId: 0, email: 'superadmin@superadmin.com', password: 'superadmin', role: 'superadmin', name: 'Super Administrator', tenantName: 'superadmin', employeeId: 'SUPERADMIN', redirectTo: '/dashboard-superAdmin' },
      // Admin
      { userId: 1001, email: 'himatif@admin.com', password: 'himatif123', role: 'admin', name: 'Admin Himatif', tenantName: 'himatif', employeeId: 'ADM001', redirectTo: '/admin/beranda' },
      // Approvers
      { userId: 2001, email: 'ilham@mail.com', password: 'ilham123', role: 'approver', name: 'Ilham', tenantName: 'himatif', employeeId: 'APP001', redirectTo: '/approver/beranda' },
      { userId: 2002, email: 'rayhan@mail.com', password: 'rayhan123', role: 'approver', name: 'Rayhan', tenantName: 'himatif', employeeId: 'APP002', redirectTo: '/approver/beranda' },
      { userId: 2003, email: 'candra@mail.com', password: 'candra123', role: 'approver', name: 'Candra', tenantName: 'himatif', employeeId: 'APP003', redirectTo: '/approver/beranda' },
      // Direktur
      { userId: 2004, email: 'direktur@mail.com', password: 'direktur123', role: 'direktur', name: 'Direktur', tenantName: 'himatif', employeeId: 'DIR001', redirectTo: '/direktur/beranda' },
      // User/General
      { userId: 3001, email: 'pegawai@mail.com', password: 'pegawai123', role: 'general', name: 'Pegawai', tenantName: 'himatif', employeeId: 'EMP001', redirectTo: '/user/beranda' },
      // ADK
      { userId: 4001, email: 'adk@mail.com', password: 'adk123', role: 'adk', name: 'ADK User', tenantName: 'himatif', employeeId: 'ADK001', redirectTo: '/adk/beranda' },
    ];

    const testAccount = testAccounts.find(acc => acc.email === email && acc.password === password);

    if (testAccount) {
      const accessToken = signToken({
        userId: testAccount.userId,
        email: testAccount.email,
        tenantName: testAccount.tenantName,
        role: testAccount.role,
        employeeId: testAccount.employeeId,
      });

      const refreshToken = signRefreshToken({
        userId: testAccount.userId,
        email: testAccount.email,
        tenantName: testAccount.tenantName,
        role: testAccount.role,
        employeeId: testAccount.employeeId,
      });

      const response = NextResponse.json({
        success: true,
        message: 'Login berhasil',
        user: {
          id: testAccount.userId,
          email: testAccount.email,
          fullName: testAccount.name,
          tenantName: testAccount.tenantName,
          role: testAccount.role,
          employeeId: testAccount.employeeId,
        },
        redirectTo: testAccount.redirectTo,
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