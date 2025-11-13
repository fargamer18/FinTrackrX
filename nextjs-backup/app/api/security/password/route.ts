import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, verifyPassword, hashPassword, validation } from '@/lib/auth';
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
    const body = await req.json();
    const { currentPassword, newPassword } = body || {};
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }
    const ok = await verifyPassword(currentPassword, user.password_hash);
    if (!ok) return NextResponse.json({ success: false, error: 'Current password is incorrect' }, { status: 400 });
    if (!validation.password(newPassword)) {
      return NextResponse.json({ success: false, error: validation.passwordMessage }, { status: 400 });
    }
    const newHash = await hashPassword(newPassword);
    await safeQuery('UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [newHash, user.id]);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Failed to update password' }, { status: 500 });
  }
}
