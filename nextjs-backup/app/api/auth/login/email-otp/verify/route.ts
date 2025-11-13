import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { safeQuery } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { mfa_token, code } = await req.json();
    if (!mfa_token || !code) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    const payload = await auth.verifyMfaToken(mfa_token);
    if (!payload) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });

    await safeQuery(`CREATE TABLE IF NOT EXISTS email_otp_codes (
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      code_hash VARCHAR(255) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    const row = await safeQuery('SELECT code_hash, expires_at FROM email_otp_codes WHERE user_id = $1 LIMIT 1', [payload.userId]);
    if (row.rowCount === 0) return NextResponse.json({ error: 'No code requested' }, { status: 400 });
    const rec = row.rows[0];
    if (new Date(rec.expires_at) < new Date()) return NextResponse.json({ error: 'Code expired' }, { status: 400 });
    const ok = await bcrypt.compare(String(code), rec.code_hash);
    if (!ok) return NextResponse.json({ error: 'Invalid code' }, { status: 401 });

    // Consume code (delete) to prevent reuse
    await safeQuery('DELETE FROM email_otp_codes WHERE user_id = $1', [payload.userId]);

    // Issue session
    const session = await auth.createToken({ userId: payload.userId, email: payload.email });
    const response = NextResponse.json({ success: true, user: { id: payload.userId, email: payload.email } });
    response.cookies.set('token', session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    return response;
  } catch (e: any) {
    console.error('Email OTP verify error:', e);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}