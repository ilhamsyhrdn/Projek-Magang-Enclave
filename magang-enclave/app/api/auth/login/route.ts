import { NextRequest, NextResponse } from 'next/server';
import { queryWithTenant } from '@/lib/db';
import { signToken, signRefreshToken } from '@/lib/jwt';
import { verifyPassword } from '@/lib/password';
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

    let user = null;
    let isAdmin = false;
    let isSuperadmin = false;

    // Cek di tabel superadmin.superadmin terlebih dahulu
    try {
      const superadminResult = await pool.query(
        'SELECT * FROM superadmin.superadmin WHERE email = $1',
        [email]
      );

      if (superadminResult.rows.length > 0) {
        user = superadminResult.rows[0];
        // Verify password
        const isValidPassword = await verifyPassword(password, user.password);
        
        if (!isValidPassword) {
          return NextResponse.json(
            { message: 'Email atau Password yang dimasukan salah, silahkan coba lagi' },
            { status: 401 }
          );
        }
        
        isSuperadmin = true;
      }
    } catch (error) {
      console.error('Error checking superadmin:', error);
    }

    // Jika bukan superadmin, cek di tabel superadmin.admins
    if (!isSuperadmin) {
      try {
        const adminResult = await pool.query(
          'SELECT * FROM superadmin.admins WHERE email = $1 AND is_active = true',
          [email]
        );

        if (adminResult.rows.length > 0) {
          user = adminResult.rows[0];
          // Verify password
          const isValidPassword = await verifyPassword(password, user.password);
          
          if (!isValidPassword) {
            return NextResponse.json(
              { message: 'Email atau Password yang dimasukan salah, silahkan coba lagi' },
              { status: 401 }
            );
          }
          
          isAdmin = true;
        }
      } catch (error) {
        console.error('Error checking admin:', error);
      }
    }

    // Jika bukan admin dan bukan superadmin, cek di semua tenant schemas
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
            const userCandidate = users[0];
            // Verify password
            const isValidPassword = await verifyPassword(password, userCandidate.password_hash);
            
            if (isValidPassword) {
              user = userCandidate;
              break;
            }
          }
        } catch (error) {
          console.error(`Error checking tenant ${tenantName}:`, error);
        }
      }
    }

    // Jika user tidak ditemukan
    if (!user) {
      return NextResponse.json(
        { message: 'Email atau Password yang dimasukan salah, silahkan coba lagi' },
        { status: 401 }
      );
    }

    // Update last_login untuk user biasa (bukan admin dan bukan superadmin)
    if (!isAdmin && !isSuperadmin && user.tenant_name) {
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

    // Tentukan redirect path berdasarkan role
    let redirectPath = '/user/beranda';

    if (isSuperadmin) {
      redirectPath = '/dashboard-superadmin';
    } else if (isAdmin) {
      redirectPath = '/admin/beranda';
    } else {
      const userRole = user.role;
      
      if (userRole === 'approver' || userRole === 'secretary') {
        redirectPath = '/approver/beranda';
      } else if (userRole === 'general') {
        redirectPath = '/user/beranda';
      } else if (userRole === 'direktur') {
        redirectPath = '/direktur/beranda';
      } else if (userRole === 'adk') {
        redirectPath = '/adk/beranda';
      } else {
        redirectPath = '/user/beranda';
      }
    }

    // Buat access token dan refresh token
    let accessToken, refreshToken, userData;

    if (isSuperadmin) {
      // Payload superadmin: hanya email dan role 'superadmin'
      const tokenPayload = {
        email: user.email,
        role: 'superadmin',
      };

      accessToken = signToken({
        userId: 0,
        email: user.email,
        tenantName: 'superadmin',
        role: 'superadmin',
        employeeId: 'SUPERADMIN',
      });

      refreshToken = signRefreshToken({
        userId: 0,
        email: user.email,
        tenantName: 'superadmin',
        role: 'superadmin',
        employeeId: 'SUPERADMIN',
      });

      userData = {
        email: user.email,
        role: 'superadmin',
      };
    } else {
      // Payload untuk admin dan user biasa
      const userRole = user.role;

      accessToken = signToken({
        userId: user.id,
        email: user.email,
        tenantName: isAdmin ? user.tenant_name : user.tenant_name,
        role: userRole,
        employeeId: isAdmin ? '' : (user.employee_id || ''),
      });

      refreshToken = signRefreshToken({
        userId: user.id,
        email: user.email,
        tenantName: isAdmin ? user.tenant_name : user.tenant_name,
        role: userRole,
        employeeId: isAdmin ? '' : (user.employee_id || ''),
      });

      userData = {
        id: user.id,
        email: user.email,
        fullName: isAdmin ? user.name : user.full_name,
        tenantName: user.tenant_name,
        role: userRole,
        employeeId: isAdmin ? '' : (user.employee_id || ''),
      };
    }

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
