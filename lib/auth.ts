// Auth utilities for password hashing and token generation
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

if (!process.env.JWT_SECRET) {
  console.warn('⚠️  WARNING: JWT_SECRET not set. Using default secret. This is unsafe for production!');
}

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Token generation
export function generateToken(): string {
  return crypto.randomUUID() + crypto.randomUUID().replace(/-/g, '');
}

// JWT tokens
export async function createToken(payload: { userId: string; email: string }): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<{ userId: string; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { userId: string; email: string };
  } catch (error) {
    return null;
  }
}

// MFA token (short‑lived, used only to complete 2FA)
export async function createMfaToken(payload: { userId: string; email: string }): Promise<string> {
  return new SignJWT({ ...payload, mfa: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('5m')
    .sign(JWT_SECRET);
}

export async function verifyMfaToken(token: string): Promise<{ userId: string; email: string; mfa: true } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload && (payload as any).mfa === true) {
      return payload as { userId: string; email: string; mfa: true };
    }
    return null;
  } catch (error) {
    return null;
  }
}

export const auth = {
  hashPassword,
  verifyPassword,
  generateToken,
  createToken,
  verifyToken,
  createMfaToken,
  verifyMfaToken,
};

// Validation schemas
export const validation = {
  email: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  
  password: (password: string) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    return password.length >= 8 &&
           /[A-Z]/.test(password) &&
           /[a-z]/.test(password) &&
           /[0-9]/.test(password);
  },

  passwordMessage: 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number',
};
