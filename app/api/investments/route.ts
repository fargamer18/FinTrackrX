import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { query, safeQuery } from '@/lib/db';
import { getQuote, getCompanyProfile } from '@/lib/finnhub';

export async function GET(request: NextRequest) {
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

    const result = await safeQuery(
      `SELECT 
        id, symbol, name, quantity, purchase_price, purchase_date, 
        current_price, currency, exchange, notes, created_at, updated_at
       FROM investments 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );

    // Calculate portfolio totals
    let totalValue = 0;
    let totalCost = 0;
    const investments = result.rows.map(inv => {
      const currentValue = inv.quantity * (inv.current_price || inv.purchase_price);
      const costValue = inv.quantity * inv.purchase_price;
      totalValue += currentValue;
      totalCost += costValue;

      return {
        ...inv,
        currentValue,
        costValue,
        gain: currentValue - costValue,
        gainPercent: ((currentValue - costValue) / costValue) * 100
      };
    });

    return NextResponse.json({
      investments,
      portfolio: {
        totalValue,
        totalCost,
        totalGain: totalValue - totalCost,
        totalGainPercent: totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0
      }
    });
  } catch (error) {
    console.error('Get investments error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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

    const { symbol, quantity, purchasePrice, purchaseDate, notes } = await request.json();

    if (!symbol || !quantity || !purchasePrice) {
      return NextResponse.json({ error: 'Symbol, quantity, and purchase price are required' }, { status: 400 });
    }

    // Fetch company info and current price from Finnhub
    let name = symbol;
    let currentPrice = purchasePrice;
    let currency = 'INR';
    let exchange = '';

    try {
      const [profile, quote] = await Promise.all([
        getCompanyProfile(symbol),
        getQuote(symbol)
      ]);

      if (profile) {
        name = profile.name || symbol;
        currency = profile.currency || 'INR';
        exchange = profile.exchange || '';
      }

      if (quote && quote.currentPrice) {
        currentPrice = quote.currentPrice;
      }
    } catch (err) {
      console.error('Failed to fetch stock data:', err);
      // Continue with provided data
    }

    const result = await safeQuery(
      `INSERT INTO investments 
        (user_id, symbol, name, quantity, purchase_price, purchase_date, current_price, currency, exchange, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        userId,
        symbol.toUpperCase(),
        name,
        quantity,
        purchasePrice,
        purchaseDate || new Date(),
        currentPrice,
        currency,
        exchange,
        notes || null
      ]
    );

    return NextResponse.json({ investment: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Create investment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
