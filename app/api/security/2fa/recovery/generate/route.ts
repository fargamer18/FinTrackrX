import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { safeQuery } from '@/lib/db';
import bcrypt from 'bcryptjs';

async function getUser(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload?.email) return null;
  const res = await safeQuery('SELECT id, email, name FROM users WHERE email = $1', [payload.email]);
  return res.rows[0];
}

function generateRecoveryCodes(count = 10): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    // 10-character alpha-numeric (excluding visually ambiguous chars)
    const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let j = 0; j < 10; j++) code += charset[Math.floor(Math.random() * charset.length)];
    codes.push(code);
  }
  return codes;
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // Ensure column exists
    await safeQuery('ALTER TABLE users ADD COLUMN IF NOT EXISTS recovery_codes TEXT');

    // Generate & hash codes
    const codes = generateRecoveryCodes();
    const hashed = await Promise.all(codes.map(c => bcrypt.hash(c, 10)));
    await safeQuery('UPDATE users SET recovery_codes = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [hashed.join('\n'), user.id]);

    return NextResponse.json({ success: true, codes }); // Return plaintext once; client must store securely
  } catch (e: any) {
    console.error('Recovery generate error:', e);
    return NextResponse.json({ success: false, error: 'Failed to generate recovery codes' }, { status: 500 });
  }
}