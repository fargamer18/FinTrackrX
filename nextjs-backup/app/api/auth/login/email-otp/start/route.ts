import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, safeQuery } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { emailService } from '@/lib/email';

// Start email OTP flow after primary credentials validated (mfa_token created by /api/auth/login)
export async function POST(req: NextRequest) {
  try {
    const { mfa_token } = await req.json();
    if (!mfa_token) return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    const payload = await auth.verifyMfaToken(mfa_token);
    if (!payload) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });

    // Ensure table exists
    await safeQuery(`CREATE TABLE IF NOT EXISTS email_otp_codes (
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      code_hash VARCHAR(255) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    // Basic rate limiting: at most 5 codes per 30 minutes
  const recent = await safeQuery('SELECT COUNT(*) FROM email_otp_codes WHERE user_id = $1 AND created_at > NOW() - INTERVAL \'30 minutes\'', [payload.userId]);
    const count = parseInt(recent.rows[0].count, 10);
    if (count >= 5) {
      return NextResponse.json({ error: 'Too many codes requested. Try later.' }, { status: 429 });
    }

    // Generate code
    const code = (Math.floor(100000 + Math.random() * 900000)).toString();
    const hash = await bcrypt.hash(code, 10);

    // Remove existing (keep history optional)
    await safeQuery('DELETE FROM email_otp_codes WHERE user_id = $1', [payload.userId]);
    await safeQuery('INSERT INTO email_otp_codes (user_id, code_hash, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'10 minutes\')', [payload.userId, hash]);

    const user = await db.getUserById(payload.userId);
    if (user) {
      const sent = await emailService.sendMfaEmailCode(user.email, user.name, code);
      if (!sent.success) {
        return NextResponse.json({ error: 'Email not configured', detail: sent.error }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, method: 'email', mfa_token });
  } catch (e: any) {
    console.error('Email OTP start error:', e);
    return NextResponse.json({ error: 'Failed to start email OTP' }, { status: 500 });
  }
}