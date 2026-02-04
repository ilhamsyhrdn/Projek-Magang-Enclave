import { NextRequest, NextResponse } from 'next/server';
import { queryWithTenant } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email, resetCode, newPassword, tenantName } = await request.json();

    if (!email || !resetCode || !newPassword || !tenantName) {
      return NextResponse.json(
        { error: 'Semua field diperlukan' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password minimal 6 karakter' },
        { status: 400 }
      );
    }

    const users = await queryWithTenant(
      tenantName,
      `SELECT id, full_name, email, reset_token_expiry
       FROM users
       WHERE email = $1
       AND reset_token = $2
       AND is_active = true`,
      [email, resetCode]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Kode reset tidak valid' },
        { status: 400 }
      );
    }

    const user = users[0];

    const now = new Date();
    const expiryTime = new Date(user.reset_token_expiry);

    if (now > expiryTime) {
      return NextResponse.json(
        { error: 'Kode reset telah kadaluarsa. Silakan minta kode baru.' },
        { status: 400 }
      );
    }

    await queryWithTenant(
      tenantName,
      `UPDATE users
       SET password_hash = $1,
           reset_token = NULL,
           reset_token_expiry = NULL,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [newPassword, user.id]
    );

    return NextResponse.json({
      success: true,
      message: 'Password berhasil diperbarui',
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mereset password' },
      { status: 500 }
    );
  }
}