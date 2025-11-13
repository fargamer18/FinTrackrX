import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { db, safeQuery } from '@/lib/db';
import { verifyTotp } from '@/lib/totp';

async function getUser(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload?.email) return null;
  const user = await db.getUserByEmail(payload.email);
  return user;
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await safeQuery('ALTER TABLE users ADD COLUMN IF NOT EXISTS twofa_enabled BOOLEAN DEFAULT false');
    await safeQuery('ALTER TABLE users ADD COLUMN IF NOT EXISTS twofa_secret VARCHAR(255)');
    const body = await req.json();
    const { token } = body || {};
    if (!token) return NextResponse.json({ success: false, error: 'Token required' }, { status: 400 });
    const res = await safeQuery('SELECT twofa_secret FROM users WHERE id = $1', [user.id]);
    const secret = res.rows[0]?.twofa_secret as string | undefined;
    if (!secret) return NextResponse.json({ success: false, error: 'No secret' }, { status: 400 });
    const ok = verifyTotp(String(token), secret);
    if (!ok) return NextResponse.json({ success: false, error: 'Invalid code' }, { status: 400 });
    await safeQuery('UPDATE users SET twofa_enabled = true, updated_at = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Failed to verify 2FA' }, { status: 500 });
  }
}
