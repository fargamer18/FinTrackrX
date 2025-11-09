import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { db, safeQuery } from '@/lib/db';

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
    await safeQuery('UPDATE users SET twofa_enabled = false, twofa_secret = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Failed to disable 2FA' }, { status: 500 });
  }
}
