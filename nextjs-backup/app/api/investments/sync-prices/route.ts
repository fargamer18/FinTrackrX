import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { query } from '@/lib/db';
import { batchUpdatePrices } from '@/lib/finnhub';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    const userId = payload.userId;

    // Get all user investments
    const result = await query(
      `SELECT id, symbol FROM investments WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'No investments to sync' });
    }

    // Get unique symbols
    const symbols = [...new Set(result.rows.map((inv: any) => inv.symbol))];

    // Fetch current prices from Finnhub
    const prices = await batchUpdatePrices(symbols);

    // Update prices in database
    const updates = await Promise.all(
      result.rows.map(async (inv: any) => {
        const price = prices[inv.symbol];
        if (price !== undefined && price > 0) {
          await query(
            `UPDATE investments SET current_price = $1, updated_at = NOW() WHERE id = $2`,
            [price, inv.id]
          );
          return { symbol: inv.symbol, updated: true, price };
        }
        return { symbol: inv.symbol, updated: false };
      })
    );

    const successCount = updates.filter(u => u.updated).length;

    return NextResponse.json({
      message: `Synced ${successCount} out of ${result.rows.length} investments`,
      updates
    });
  } catch (error) {
    console.error('Sync prices error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
