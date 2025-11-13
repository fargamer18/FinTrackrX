import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const start = Date.now();
    const res = await query('SELECT 1 as ok');
    const ms = Date.now() - start;
    return NextResponse.json({ success: true, db: 'ok', latency_ms: ms, result: res.rows[0] });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'db-error' }, { status: 500 });
  }
}