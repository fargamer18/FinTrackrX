import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { db, safeQuery } from '@/lib/db';

async function getUserIdFromCookie(req: NextRequest): Promise<string | null> {
  const token = req.cookies.get('token')?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload?.email) return null;
  const user = await db.getUserByEmail(payload.email);
  return user?.id || null;
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserIdFromCookie(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // Ensure avatar_url column exists
    await safeQuery('ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT');
    const result = await safeQuery('SELECT id, email, name, phone, bio, avatar_url, created_at FROM users WHERE id = $1', [userId]);
    return NextResponse.json({ success: true, user: result.rows[0] });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Failed to load profile' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = await getUserIdFromCookie(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // Ensure avatar_url column exists
    await safeQuery('ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT');
    const body = await req.json();
    const { name, phone, bio, avatar_url } = body || {};
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;
    for (const [key, value] of Object.entries({ name, phone, bio, avatar_url })) {
      if (value === undefined) continue;
      fields.push(`${key} = $${idx}`);
      values.push(value);
      idx++;
    }
    if (fields.length) {
      values.push(userId);
      await safeQuery(`UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${idx}`, values);
    }
    const fresh = await safeQuery('SELECT id, email, name, phone, bio, avatar_url, created_at FROM users WHERE id = $1', [userId]);
    return NextResponse.json({ success: true, user: fresh.rows[0] });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Failed to update profile' }, { status: 500 });
  }
}
