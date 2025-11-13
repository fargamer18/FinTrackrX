import { NextRequest, NextResponse } from 'next/server';
import { safeQuery, db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { email, code, new_password } = await req.json();
    if (!email || !code || !new_password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    if (String(new_password).length < 8) {
      return NextResponse.json({ error: 'Password too short (min 8 chars)' }, { status: 400 });
    }

    await safeQuery(`CREATE TABLE IF NOT EXISTS password_reset_otp_codes (
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      code_hash VARCHAR(255) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    const user = await db.getUserByEmail(String(email).toLowerCase());
    if (!user) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 }); // preserve ambiguity
    }

    const row = await safeQuery('SELECT code_hash, expires_at FROM password_reset_otp_codes WHERE user_id = $1 LIMIT 1', [user.id]);
    if (row.rowCount === 0) return NextResponse.json({ error: 'Code not found or expired' }, { status: 400 });
    const rec = row.rows[0];
    if (new Date(rec.expires_at) < new Date()) return NextResponse.json({ error: 'Code expired' }, { status: 400 });
    const ok = await bcrypt.compare(String(code), rec.code_hash);
    if (!ok) return NextResponse.json({ error: 'Invalid code' }, { status: 401 });

    // Update password
    const newHash = await bcrypt.hash(String(new_password), 12);
    await safeQuery('UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [newHash, user.id]);
    await safeQuery('DELETE FROM password_reset_otp_codes WHERE user_id = $1', [user.id]);

    return NextResponse.json({ success: true, message: 'Password updated' });
  } catch (e: any) {
    console.error('Password reset OTP verify error:', e);
    return NextResponse.json({ error: 'Password update failed' }, { status: 500 });
  }
}
