import { NextRequest, NextResponse } from 'next/server';
import { db, safeQuery } from '@/lib/db';
import { auth } from '@/lib/auth';
import { verifyTotp } from '@/lib/totp';

// Lazy bootstrap: create minimal users table if it does not exist (Supabase fresh DB)
let ensuredUsersTable = false;
async function ensureUsersTable() {
  if (ensuredUsersTable) return;
  try {
    await safeQuery('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
    await safeQuery(`CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255),
      phone VARCHAR(32),
      bio TEXT,
      avatar_url TEXT,
      twofa_enabled BOOLEAN DEFAULT false,
      twofa_secret VARCHAR(255),
      password_hash VARCHAR(255) NOT NULL,
      is_verified BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      last_login TIMESTAMP WITH TIME ZONE
    )`);
  } catch (e) {
    console.error('Lazy users table creation failed:', e);
  } finally {
    ensuredUsersTable = true;
  }
}

export async function POST(req: NextRequest) {
  try {
  const { email, password, totp } = await req.json();

  // Ensure core table exists to avoid 42P01 errors on fresh Supabase
  await ensureUsersTable();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get user
    const user = await db.getUserByEmail(email.toLowerCase());
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await auth.verifyPassword(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // 2FA check: if enabled, require TOTP; if missing, return mfa_required
    if (user.twofa_enabled) {
      // Ensure secret loaded
      const row = await safeQuery('SELECT twofa_secret FROM users WHERE id = $1', [user.id]);
      const secret = row.rows[0]?.twofa_secret as string | undefined;
      if (!secret) {
        console.warn('User has twofa_enabled but no secret stored');
      } else {
        if (!totp) {
          // Issue short-lived MFA token for second step
          const mfaToken = await auth.createMfaToken({ userId: user.id, email: user.email });
          return NextResponse.json({ success: false, mfa_required: true, mfa_token: mfaToken });
        }
        const ok = verifyTotp(String(totp), secret);
        if (!ok) {
          return NextResponse.json({ error: 'Invalid TOTP code', mfa_required: true }, { status: 401 });
        }
      }
    }

    // Update last login
    await db.updateLastLogin(user.id);

    // Create JWT token
    const token = await auth.createToken({ userId: user.id, email: user.email });

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
      token,
    });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
