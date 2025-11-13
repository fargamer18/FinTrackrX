import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';
import { getUserAccounts, updateAccount, createAccount } from '@/lib/accounts';

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
    const accounts = await getUserAccounts(userId);
    return NextResponse.json({ success: true, accounts });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Failed to fetch accounts' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = await getUserIdFromCookie(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await req.json();
    const { accountId, name, currency, is_active } = body || {};
    if (!accountId) return NextResponse.json({ success: false, error: 'accountId required' }, { status: 400 });
    await updateAccount(userId, accountId, { name, currency, is_active });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Failed to update account' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromCookie(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await req.json();
    const { name, type, currency, balance } = body || {};
    if (!name || !type) return NextResponse.json({ success: false, error: 'name and type required' }, { status: 400 });
    await createAccount(userId, { name, type, currency, balance });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Failed to create account' }, { status: 500 });
  }
}
