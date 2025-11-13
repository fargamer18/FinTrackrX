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

export async function GET(req: NextRequest) {
  try {
    const user = await getUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // Ensure columns exist for legacy DBs
    await safeQuery('ALTER TABLE users ADD COLUMN IF NOT EXISTS twofa_enabled BOOLEAN DEFAULT false');
    await safeQuery('ALTER TABLE users ADD COLUMN IF NOT EXISTS twofa_secret VARCHAR(255)');
    const res = await safeQuery('SELECT twofa_enabled FROM users WHERE id = $1', [user.id]);
    return NextResponse.json({ success: true, enabled: res.rows[0]?.twofa_enabled === true });
  } catch (e: any) {
    // Fallback to disabled rather than blocking UI
    return NextResponse.json({ success: true, enabled: false, note: e?.message || 'status-fallback' });
  }
}
