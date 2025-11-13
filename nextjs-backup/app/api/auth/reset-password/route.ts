import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth, validation } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    if (!validation.password(password)) {
      return NextResponse.json(
        { error: validation.passwordMessage },
        { status: 400 }
      );
    }

    // Verify token
    const resetToken = await db.getVerificationToken(token);
    if (!resetToken) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Hash new password
    const passwordHash = await auth.hashPassword(password);

    // Update password
    await db.updateUserPassword(resetToken.user_id, passwordHash);

    // Delete token
    await db.deleteVerificationToken(token);

    return NextResponse.json({
      success: true,
      message: 'Password reset successful! You can now login with your new password.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}
