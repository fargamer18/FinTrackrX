import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    // Quick guard: only allow in non-production
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ success: false, error: 'Not allowed in production' }, { status: 403 });
    }

    // If users table exists, skip
    const exists = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'users'
      ) AS present;
    `);
    if (exists.rows[0]?.present) {
      return NextResponse.json({ success: true, note: 'users table already exists' });
    }

    const schemaPath = path.join(process.cwd(), 'database', 'schema.sql');
    let sql = fs.readFileSync(schemaPath, 'utf8');
    // Supabase: prefer pgcrypto/gen_random_uuid over uuid-ossp/uuid_generate_v4
    sql = sql.replace(/CREATE EXTENSION IF NOT EXISTS\s+"uuid-ossp";?/gi, 'CREATE EXTENSION IF NOT EXISTS "pgcrypto";');
    sql = sql.replace(/uuid_generate_v4\(\)/gi, 'gen_random_uuid()');

    // Execute as a single batch
    await query(sql);

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'bootstrap-failed' }, { status: 500 });
  }
}

export async function GET() { // Convenience to run from browser
  return POST({} as NextRequest);
}