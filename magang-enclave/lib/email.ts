import nodemailer from 'nodemailer';

interface ResetEmailOptions {
  email: string;
  fullName: string;
  resetLink: string;
}

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
  fromName: string;
}

// Check apakah email verification di-enable
export function isEmailVerificationEnabled(): boolean {
  return process.env.ENABLE_EMAIL_VERIFICATION === 'true';
}

// Create transporter
function createTransporter() {
  const config: EmailConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASSWORD || '',
    },
    from: process.env.SMTP_FROM || process.env.SMTP_USER || '',
    fromName: process.env.SMTP_FROM_NAME || 'E-Office',
  };

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.auth.user,
      pass: config.auth.pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

/**
 * Kirim email reset password
 * Production: Kirim email menggunakan Nodemailer
 * Development: Log ke console saja
 */
export async function sendResetEmail({
  email,
  fullName,
  resetLink,
}: ResetEmailOptions): Promise<boolean> {
  const shouldSendEmail = isEmailVerificationEnabled();

  if (!shouldSendEmail) {
    // Development mode - log ke console saja
    console.log('\n========== RESET PASSWORD EMAIL (DEV MODE) ==========');
    console.log(`To: ${email}`);
    console.log(`Name: ${fullName}`);
    console.log(`Link: ${resetLink}`);
    console.log('=====================================================\n');
    return true;
  }

  // Production mode - kirim email beneran
  try {
    // Validasi environment variables
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.error('[Email Service] SMTP configuration not complete');
      return false;
    }

    const transporter = createTransporter();
    const fromName = process.env.SMTP_FROM_NAME || 'E-Office';
    const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER;

    // Template email HTML
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Password - E-Office</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      padding: 30px 20px;
      background-color: #4180a9;
      border-radius: 8px 8px 0 0;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 28px;
      font-weight: bold;
    }
    .content {
      padding: 40px 30px;
    }
    .content h2 {
      color: #4180a9;
      font-size: 24px;
      margin-top: 0;
      margin-bottom: 20px;
    }
    .content p {
      margin-bottom: 20px;
      color: #555;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background-color: #4180a9;
      color: #ffffff;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      font-size: 16px;
      margin: 20px 0;
    }
    .button:hover {
      background-color: #356890;
    }
    .footer {
      text-align: center;
      padding: 20px;
      border-top: 1px solid #e0e0e0;
      color: #888;
      font-size: 12px;
    }
    .warning {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 12px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .info-box {
      background-color: #e3f2fd;
      border-left: 4px solid #2196f3;
      padding: 12px;
      margin: 20px 0;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏢 E-Office</h1>
    </div>
    
    <div class="content">
      <h2>Reset Password</h2>
      
      <p>Halo <strong>${fullName || 'Pengguna'}</strong>,</p>
      
      <p>Kami menerima permintaan untuk mereset password akun E-Office Anda. Jika Anda merasa tidak melakukan permintaan ini, silakan abaikan email ini.</p>
      
      <p>Untuk mereset password Anda, klik tombol di bawah ini:</p>
      
      <div style="text-align: center;">
        <a href="${resetLink}" class="button">Reset Password Sekarang</a>
      </div>
      
      <p style="word-break: break-all; font-size: 14px; color: #666;">
        Atau copy dan paste link ini ke browser:<br>
        <strong>${resetLink}</strong>
      </p>
      
      <div class="info-box">
        <p style="margin: 0;"><strong>⏰ Waktu Validitas:</strong> Link ini hanya berlaku selama 1 jam.</p>
      </div>
      
      <div class="warning">
        <p style="margin: 0;"><strong>⚠️ Penting:</strong> Jangan berikan link reset password ini kepada siapa pun. Staf E-Office tidak akan pernah meminta link reset password Anda.</p>
      </div>
      
      <p>Terima kasih telah menggunakan E-Office.</p>
      
      <p>Salam,<br><strong>Tim E-Office</strong></p>
    </div>
    
    <div class="footer">
      <p>Email ini dikirim secara otomatis. Jangan balas email ini.</p>
      <p>&copy; ${new Date().getFullYear()} E-Office. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;

    // Text version untuk email client yang tidak support HTML
    const textContent = `
RESET PASSWORD - E-OFFICE

Halo ${fullName || 'Pengguna'},

Kami menerima permintaan untuk mereset password akun E-Office Anda. Jika Anda merasa tidak melakukan permintaan ini, silakan abaikan email ini.

Untuk mereset password Anda, klik link berikut:

${resetLink}

Atau copy dan paste link ini ke browser:
${resetLink}

⏰ Waktu Validitas: Link ini hanya berlaku selama 1 jam.

⚠️ Penting: Jangan berikan link reset password ini kepada siapa pun. Staf E-Office tidak akan pernah meminta link reset password Anda.

Terima kasih telah menggunakan E-Office.

Salam,
Tim E-Office

---

Email ini dikirim secara otomatis. Jangan balas email ini.
© ${new Date().getFullYear()} E-Office. All rights reserved.
    `.trim();

    // Kirim email
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: email,
      subject: '🔑 Reset Password - E-Office',
      text: textContent,
      html: htmlContent,
      priority: 'high',
    });

    console.log(`[Email Service] Email sent successfully! Message ID: ${info.messageId}`);
    console.log(`[Email Service] To: ${email}`);
    
    return true;

  } catch (error) {
    console.error('[Email Service] Failed to send email:', error);
    return false;
  }
}

/**
 * Tes koneksi SMTP
 */
export async function testSMTPConnection(): Promise<boolean> {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('[Email Service] SMTP connection verified successfully');
    return true;
  } catch (error) {
    console.error('[Email Service] SMTP connection failed:', error);
    return false;
  }
}
