import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth, validation } from '@/lib/auth';
import { emailService } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (!validation.email(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    if (!validation.password(password)) {
      return NextResponse.json(
        { error: validation.passwordMessage },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await db.getUserByEmail(email.toLowerCase());
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await auth.hashPassword(password);

    // Create user
    const user = await db.createUser(email.toLowerCase(), name, passwordHash);

    // Generate verification token
    const verificationToken = auth.generateToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await db.createVerificationToken(user.id, verificationToken, expiresAt);

    // Send verification email
    await emailService.sendVerificationEmail(email, name, verificationToken);

    // Create JWT token for immediate login (optional - can require verification first)
    const token = await auth.createToken({ userId: user.id, email: user.email });

    return NextResponse.json({
      success: true,
      message: 'Account created! Please check your email to verify your account.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
