import { NextRequest, NextResponse } from 'next/server';
import { db, safeQuery } from '@/lib/db';
import { auth } from '@/lib/auth';
import { verifyTotp } from '@/lib/totp';

export async function POST(req: NextRequest) {
  try {
    const { mfa_token, code } = await req.json();
    if (!mfa_token || !code) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    const payload = await auth.verifyMfaToken(mfa_token);
    if (!payload) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });

    const user = await db.getUserById(payload.userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    const row = await safeQuery('SELECT twofa_secret FROM users WHERE id = $1', [payload.userId]);
    const secret = row.rows[0]?.twofa_secret as string | undefined;
    if (!secret) return NextResponse.json({ error: '2FA not configured' }, { status: 400 });

    const ok = verifyTotp(String(code), secret);
    if (!ok) return NextResponse.json({ error: 'Invalid code' }, { status: 401 });

    // Success: issue session JWT cookie
    const token = await auth.createToken({ userId: payload.userId, email: payload.email });
    const response = NextResponse.json({ success: true, user: { id: payload.userId, email: payload.email } });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    // Update last login
    await db.updateLastLogin(payload.userId);
    return response;
  } catch (error) {
    console.error('MFA verify error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
