import { NextRequest, NextResponse } from 'next/server';
import { db, safeQuery } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { emailService } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    // Ensure table exists
    await safeQuery(`CREATE TABLE IF NOT EXISTS password_reset_otp_codes (
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      code_hash VARCHAR(255) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    const user = await db.getUserByEmail(email.toLowerCase());

    // Always respond success to avoid user enumeration.
    if (!user) {
      return NextResponse.json({ success: true });
    }

    // Basic rate limiting: at most 5 codes per 30 minutes
    const recent = await safeQuery(
      `SELECT COUNT(*) FROM password_reset_otp_codes 
       WHERE user_id = $1 AND created_at > NOW() - INTERVAL '30 minutes'`,
      [user.id]
    );
    const count = parseInt(recent.rows[0].count, 10);
    if (count >= 5) {
      return NextResponse.json({ error: 'Too many codes requested. Try later.' }, { status: 429 });
    }

    const code = (Math.floor(100000 + Math.random() * 900000)).toString();
    const hash = await bcrypt.hash(code, 10);

    await safeQuery('DELETE FROM password_reset_otp_codes WHERE user_id = $1', [user.id]);
    await safeQuery(
      'INSERT INTO password_reset_otp_codes (user_id, code_hash, expires_at) VALUES ($1, $2, NOW() + INTERVAL ' + "'10 minutes'" + ')',
      [user.id, hash]
    );

    await emailService.sendPasswordResetCode(user.email, user.name, code);

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('Password reset OTP start error:', e);
    return NextResponse.json({ error: 'Failed to start password reset' }, { status: 500 });
  }
}
