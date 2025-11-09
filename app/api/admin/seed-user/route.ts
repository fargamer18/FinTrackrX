import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ success: false, error: 'Not allowed in production' }, { status: 403 });
    }
    const body = await req.json();
    const email = String(body?.email || '').toLowerCase();
    const password = String(body?.password || '');
    const name = String(body?.name || 'User');
    if (!email || !password) return NextResponse.json({ success: false, error: 'email and password required' }, { status: 400 });

    // Ensure users table exists at least minimally
    await query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);
    await query(`CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255),
      password_hash VARCHAR(255) NOT NULL,
      twofa_enabled BOOLEAN DEFAULT false,
      twofa_secret VARCHAR(255),
      is_verified BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )`);

    const hashed = await hashPassword(password);
    const res = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (res.rowCount && res.rowCount > 0) {
      await query('UPDATE users SET password_hash = $1, name = $2, updated_at = CURRENT_TIMESTAMP WHERE email = $3', [hashed, name, email]);
      return NextResponse.json({ success: true, updated: true });
    } else {
      const ins = await query('INSERT INTO users (email, name, password_hash, is_verified) VALUES ($1, $2, $3, true) RETURNING id', [email, name, hashed]);
      return NextResponse.json({ success: true, created: true, id: ins.rows[0].id });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'seed-failed' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ success: false, error: 'POST email/password' }, { status: 405 });
}