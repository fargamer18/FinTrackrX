#!/usr/bin/env ts-node
import { query } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

async function run() {
  const email = process.argv[2];
  const password = process.argv[3];
  const name = process.argv[4] || 'User';
  if (!email || !password) {
    console.error('Usage: ts-node scripts/seed-user.ts <email> <password> [name]');
    process.exit(1);
  }
  try {
    console.log(`🔐 Seeding user ${email} ...`);
    // Ensure users table exists (Supabase should already have schema); create minimally if missing.
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

    const existing = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    const hashed = await hashPassword(password);
  if ((existing?.rowCount || 0) > 0) {
      await query('UPDATE users SET password_hash = $1, name = $2, updated_at = CURRENT_TIMESTAMP WHERE email = $3', [hashed, name, email.toLowerCase()]);
      console.log('✅ Updated existing user password & name.');
    } else {
      const res = await query('INSERT INTO users (email, name, password_hash, is_verified) VALUES ($1, $2, $3, true) RETURNING id', [email.toLowerCase(), name, hashed]);
      console.log('✅ Created user with id:', res.rows[0].id);
    }
  } catch (e: any) {
    console.error('❌ Seed failed:', e.message || e);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

run();