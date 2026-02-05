import { NextRequest, NextResponse } from 'next/server';
import { queryWithTenant } from '@/lib/db';
import { hashPassword, isPasswordHashEnabled } from '@/lib/password';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email, token, newPassword } = await request.json();

    console.log('[Reset Password] Request received for email:', email);
    console.log('[Reset Password] Password hashing:', isPasswordHashEnabled() ? 'enabled' : 'disabled');

    // Validasi input
    if (!email || !token || !newPassword) {
      return NextResponse.json(
        { error: 'Semua field harus diisi' },
        { status: 400 }
      );
    }

    // Validasi panjang password
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password minimal 6 karakter' },
        { status: 400 }
      );
    }

    // Ambil semua tenant yang aktif
    let tenants = [];
    try {
      const tenantsResult = await pool.query(
        'SELECT DISTINCT tenant_name FROM superadmin.admins WHERE is_active = true'
      );
      tenants = tenantsResult.rows.map(row => row.tenant_name);
      console.log('[Reset Password] Found tenants:', tenants);
    } catch (error) {
      console.error('[Reset Password] Error fetching tenants:', error);
      return NextResponse.json(
        { error: 'Terjadi kesalahan saat memproses permintaan' },
        { status: 500 }
      );
    }

    // Cari user dengan email dan token di semua tenant schemas
    let foundUser = null;
    let foundTenant = null;

    for (const tenantName of tenants) {
      try {
        const users = await queryWithTenant(
          tenantName,
          `SELECT * FROM users 
           WHERE email = $1 
           AND reset_token = $2 
           AND is_active = true`,
          [email, token]
        );

        if (users.length > 0) {
          foundUser = users[0];
          foundTenant = tenantName;
          console.log('[Reset Password] User found in tenant:', tenantName);
          break;
        }
      } catch (error) {
        console.error(`[Reset Password] Error checking tenant ${tenantName}:`, error);
      }
    }

    // User tidak ditemukan dengan token yang valid
    if (!foundUser) {
      console.log('[Reset Password] User not found or invalid token');
      return NextResponse.json(
        { error: 'Token tidak valid atau telah expired' },
        { status: 400 }
      );
    }

    // Cek apakah token sudah expired
    if (foundUser.reset_token_expiry && new Date(foundUser.reset_token_expiry) < new Date()) {
      console.log('[Reset Password] Token expired');
      return NextResponse.json(
        { error: 'Token telah expired, silahkan minta link reset baru' },
        { status: 400 }
      );
    }

    // Hash password jika production mode
    let passwordToSave = newPassword;
    if (isPasswordHashEnabled()) {
      console.log('[Reset Password] Hashing password...');
      passwordToSave = await hashPassword(newPassword);
    } else {
      console.log('[Reset Password] Saving password as plain text (dev mode)');
    }

    // Update password user
    try {
      await queryWithTenant(
        foundTenant,
        `UPDATE users 
         SET password_hash = $1,
             reset_token = NULL,
             reset_token_expiry = NULL,
             updated_at = NOW()
         WHERE id = $2`,
        [passwordToSave, foundUser.id]
      );
      console.log('[Reset Password] Password updated successfully');
    } catch (error) {
      console.error('[Reset Password] Error updating password:', error);
      return NextResponse.json(
        { error: 'Terjadi kesalahan saat mengubah password' },
        { status: 500 }
      );
    }

    console.log(`[Reset Password Success] Email: ${email}, Tenant: ${foundTenant}`);

    return NextResponse.json({
      success: true,
      message: 'Password berhasil diubah',
    });

  } catch (error) {
    console.error('[Reset Password] Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server, silahkan coba lagi' },
      { status: 500 }
    );
  }
}
