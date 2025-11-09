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

    await safeQuery('ALTER TABLE users ADD COLUMN IF NOT EXISTS recovery_codes TEXT');
    const res = await safeQuery('SELECT recovery_codes FROM users WHERE id = $1', [payload.userId]);
    const stored = res.rows[0]?.recovery_codes as string | null;
    if (!stored) return NextResponse.json({ error: 'No recovery codes issued' }, { status: 400 });
    const hashes = stored.split('\n').filter(Boolean);

    let matchIndex = -1;
    for (let i = 0; i < hashes.length; i++) {
      const ok = await bcrypt.compare(String(code), hashes[i]);
      if (ok) { matchIndex = i; break; }
    }
    if (matchIndex === -1) return NextResponse.json({ error: 'Invalid recovery code' }, { status: 401 });

    // Consume the matched code: remove from list
    hashes.splice(matchIndex, 1);
    await safeQuery('UPDATE users SET recovery_codes = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [hashes.join('\n'), payload.userId]);

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
    console.error('Recovery login error:', e);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}