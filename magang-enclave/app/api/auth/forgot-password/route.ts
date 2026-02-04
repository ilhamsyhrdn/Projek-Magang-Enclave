import { NextRequest, NextResponse } from 'next/server';
import { queryWithTenant } from '@/lib/db';
import nodemailer from 'nodemailer';

function generateResetCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { email, tenantName } = await request.json();

    if (!email || !tenantName) {
      return NextResponse.json(
        { error: 'Email dan tenant name diperlukan' },
        { status: 400 }
      );
    }

    const users = await queryWithTenant(
      tenantName,
      'SELECT id, full_name, email FROM users WHERE email = $1 AND is_active = true',
      [email]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Email tidak terdaftar' },
        { status: 404 }
      );
    }

    const user = users[0];
    const resetCode = generateResetCode();

    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 15);

    await queryWithTenant(
      tenantName,
      `UPDATE users
       SET reset_token = $1, reset_token_expiry = $2
       WHERE id = $3`,
      [resetCode, expiryTime, user.id]
    );

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Reset Password - Enclave E-office',
      html: `
        <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4180a9;">Reset Password</h2>
          <p>Halo ${user.full_name},</p>
          <p>Kami menerima permintaan untuk mereset password akun Anda.</p>
          <p>Gunakan kode berikut untuk mereset password Anda:</p>

          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 10px;">
            <h1 style="color: #4180a9; letter-spacing: 5px; margin: 0;">${resetCode}</h1>
          </div>

          <p style="color: #666;">Kode ini akan kadaluarsa dalam <strong>15 menit</strong>.</p>
          <p style="color: #666;">Jika Anda tidak meminta reset password, abaikan email ini.</p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">
            Email ini dikirim secara otomatis, mohon tidak membalas email ini.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'Kode reset password telah dikirim ke email Anda',
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memproses permintaan' },
      { status: 500 }
    );
  }
}