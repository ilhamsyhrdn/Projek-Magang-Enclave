import { NextRequest, NextResponse } from 'next/server';
import { queryWithTenant } from '@/lib/db';
import pool from '@/lib/db';
import { sendResetEmail, isEmailVerificationEnabled } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email harus diisi' },
        { status: 400 }
      );
    }

    const shouldSendEmail = isEmailVerificationEnabled();
    console.log('[Forgot Password] Email verification:', shouldSendEmail ? 'enabled' : 'disabled');

    // Ambil semua tenant yang aktif
    let tenants = [];
    try {
      const tenantsResult = await pool.query(
        'SELECT DISTINCT tenant_name FROM superadmin.admins WHERE is_active = true'
      );
      tenants = tenantsResult.rows.map(row => row.tenant_name);
      console.log('[Forgot Password] Found tenants:', tenants);
    } catch (error) {
      console.error('[Forgot Password] Error fetching tenants:', error);
      return NextResponse.json(
        { error: 'Terjadi kesalahan saat memproses permintaan' },
        { status: 500 }
      );
    }

    // Cari user di semua tenant schemas
    let foundUser = null;
    let foundTenant = null;

    for (const tenantName of tenants) {
      try {
        const users = await queryWithTenant(
          tenantName,
          'SELECT * FROM users WHERE email = $1 AND is_active = true',
          [email]
        );

        if (users.length > 0) {
          foundUser = users[0];
          foundTenant = tenantName;
          console.log('[Forgot Password] User found in tenant:', tenantName);
          break;
        }
      } catch (error) {
        console.error(`[Forgot Password] Error checking tenant ${tenantName}:`, error);
      }
    }

    // Return success meskipun user tidak ditemukan (security best practice)
    if (!foundUser) {
      console.log('[Forgot Password] User not found:', email);
      return NextResponse.json({
        success: true,
        message: 'Jika email terdaftar, link reset akan dikirim',
      });
    }

    // Generate token reset menggunakan crypto
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Set expiry token (1 jam)
    const expiryTime = new Date(Date.now() + 60 * 60 * 1000);

    // Simpan token reset ke database
    try {
      await queryWithTenant(
        foundTenant,
        'UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE id = $3',
        [resetToken, expiryTime, foundUser.id]
      );
      console.log('[Forgot Password] Reset token saved successfully');
    } catch (error) {
      console.error('[Forgot Password] Error updating reset token:', error);
      return NextResponse.json(
        { error: 'Terjadi kesalahan saat menyimpan token reset' },
        { status: 500 }
      );
    }

    // Buat link reset password
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const resetLink = `${baseUrl}/reset-password?email=${encodeURIComponent(email)}&token=${resetToken}`;

    // Kirim email reset password
    const emailSent = await sendResetEmail({
      email,
      fullName: foundUser.full_name || email,
      resetLink,
    });

    if (emailSent) {
      if (shouldSendEmail) {
        console.log(`[Forgot Password] Reset email sent to: ${email}`);
      } else {
        console.log(`[Forgot Password] Reset link logged to console (development mode)`);
      }
    } else {
      console.error('[Forgot Password] Failed to send reset email');
      // Tetap return success tapi log error untuk monitoring
    }

    // Return response
    return NextResponse.json({
      success: true,
      message: shouldSendEmail 
        ? 'Link reset berhasil dikirim ke email Anda'
        : 'Link reset berhasil dikirim (cek console server untuk link)',
      // Hanya untuk development - di production hapus field ini
      resetLink: !shouldSendEmail ? resetLink : undefined,
    });

  } catch (error) {
    console.error('[Forgot Password] Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server, silahkan coba lagi' },
      { status: 500 }
    );
  }
}
