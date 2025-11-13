import { NextRequest, NextResponse } from 'next/server';
import { getUserSettings, updateUserSettings } from '@/lib/settings';
import { verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';

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
    const settings = await getUserSettings(userId);
    return NextResponse.json({ success: true, settings });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = await getUserIdFromCookie(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await req.json();
    const updated = await updateUserSettings(userId, body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Failed to update settings' }, { status: 500 });
  }
}
