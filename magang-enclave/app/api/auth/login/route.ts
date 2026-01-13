// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { queryWithTenant } from '@/lib/db';
import { signToken } from '@/lib/jwt';
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

    // 1. CEK SUPERADMIN HARDCODED
    if (email === 'superadmin@superadmin.com' && password === 'superadmin') {
      const token = signToken({
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
        redirectTo: '/dashboard-superAdmin',
      });

      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return response;
    }

    let user = null;
    let isAdmin = false;

    // 2. CEK ADMIN DI TABEL superadmin.admins
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

    // 3. JIKA BUKAN ADMIN, CARI DI TENANT USERS
    if (!user) {
      // Ambil list tenant dari superadmin.admins
      const tenantsResult = await pool.query(
        'SELECT DISTINCT tenant_name FROM superadmin.admins WHERE is_active = true'
      );
      
      const tenants = tenantsResult.rows.map(row => row.tenant_name);

      // Cari user di setiap tenant
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

    // 4. JIKA USER TIDAK DITEMUKAN
    if (!user) {
      return NextResponse.json(
        { message: 'Email atau Password yang dimasukan salah, silahkan coba lagi' },
        { status: 401 }
      );
    }

    // 5. VERIFIKASI PASSWORD (PLAIN TEXT)
    const passwordField = isAdmin ? user.password : user.password_hash;
    
    if (passwordField !== password) {
      return NextResponse.json(
        { message: 'Email atau Password yang dimasukan salah, silahkan coba lagi' },
        { status: 401 }
      );
    }

    // 6. UPDATE LAST LOGIN (hanya untuk tenant user)
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

    // 7. DETERMINE REDIRECT PATH BASED ON ROLE
    let redirectPath = '/beranda-user'; // default
    const userRole = user.role;

    if (isAdmin) {
      // Admin dari tabel superadmin.admins
      redirectPath = '/beranda-admin';
    } else {
      // User dari tabel tenant.users
      if (userRole === 'president') {
        redirectPath = '/beranda-approver';
      } else if (userRole === 'general' || userRole === 'secretary') {
        redirectPath = '/beranda-user';
      } else {
        // Default untuk role lainnya
        redirectPath = '/beranda-user';
      }
    }

    // 8. GENERATE JWT TOKEN
    const token = signToken({
      userId: user.id,
      email: user.email,
      tenantName: isAdmin ? user.tenant_name : user.tenant_name,
      role: userRole,
      employeeId: isAdmin ? '' : (user.employee_id || ''),
    });

    // 9. PREPARE RESPONSE DATA
    const userData = {
      id: user.id,
      email: user.email,
      fullName: isAdmin ? user.name : user.full_name,
      tenantName: user.tenant_name,
      role: userRole,
      employeeId: isAdmin ? '' : (user.employee_id || ''),
    };

    // 10. SET COOKIE AND RETURN RESPONSE
    const response = NextResponse.json({
      success: true,
      message: 'Login berhasil',
      user: userData,
      redirectTo: redirectPath,
    });

    response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 6,
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