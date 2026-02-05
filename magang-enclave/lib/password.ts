import bcrypt from 'bcryptjs';

// Round untuk hashing (10 = balance antara security dan performance)
const SALT_ROUNDS = 10;

/**
 * Hash password menggunakan bcrypt
 * Di production: password akan di-hash
 * Di development: password tidak di-hash (plain text)
 */
export async function hashPassword(password: string): Promise<string> {
  const shouldHash = process.env.ENABLE_PASSWORD_HASH === 'true';

  if (!shouldHash) {
    // Development mode - return plain text
    console.log('[Password] Development mode: password not hashed');
    return password;
  }

  // Production mode - hash password
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    console.log('[Password] Password hashed successfully');
    return hashedPassword;
  } catch (error) {
    console.error('[Password] Error hashing password:', error);
    throw new Error('Gagal melakukan hashing password');
  }
}

/**
 * Verify password dengan hashed password
 * Di production: verify menggunakan bcrypt
 * Di development: direct comparison (plain text)
 */
export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  const shouldHash = process.env.ENABLE_PASSWORD_HASH === 'true';

  if (!shouldHash) {
    // Development mode - direct comparison
    console.log('[Password] Development mode: direct comparison');
    return plainPassword === hashedPassword;
  }

  // Production mode - bcrypt verification
  try {
    const isValid = await bcrypt.compare(plainPassword, hashedPassword);
    console.log('[Password] Password verification:', isValid ? 'valid' : 'invalid');
    return isValid;
  } catch (error) {
    console.error('[Password] Error verifying password:', error);
    return false;
  }
}

/**
 * Check apakah password hashing di-enable
 */
export function isPasswordHashEnabled(): boolean {
  return process.env.ENABLE_PASSWORD_HASH === 'true';
}

/**
 * Generate random password (default 12 karakter)
 */
export function generateRandomPassword(length: number = 12): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}
