// api/test-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { testSMTPConnection, sendResetEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  // Test SMTP connection
  const isConnected = await testSMTPConnection();

  if (!isConnected) {
    return NextResponse.json({
      success: false,
      message: 'SMTP connection failed',
    });
  }

  // Kirim test email
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const resetLink = `${baseUrl}/reset-password?email=test@example.com&token=abc123`;

  const emailSent = await sendResetEmail({
    email: 'your-email@example.com', // Ganti dengan email Anda
    fullName: 'Test User',
    resetLink,
  });

  if (emailSent) {
    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
    });
  } else {
    return NextResponse.json({
      success: false,
      message: 'Failed to send test email',
    });
  }
}