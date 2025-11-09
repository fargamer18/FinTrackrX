import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { query } from '@/lib/db';
import { getQuote, getCompanyProfile } from '@/lib/finnhub';

type ParamsPromise = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: ParamsPromise) {
  try {
    const { id } = await context.params;
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    const userId = payload.userId;

    const result = await query(
      `SELECT * FROM investments WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Investment not found' }, { status: 404 });
    }

    return NextResponse.json({ investment: result.rows[0] });
  } catch (error) {
    console.error('Get investment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: ParamsPromise) {
  try {
    const { id } = await context.params;
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    const userId = payload.userId;

    const { quantity, purchasePrice, purchaseDate, notes } = await request.json();

    const result = await query(
      `UPDATE investments 
       SET quantity = COALESCE($1, quantity),
           purchase_price = COALESCE($2, purchase_price),
           purchase_date = COALESCE($3, purchase_date),
           notes = COALESCE($4, notes)
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [quantity, purchasePrice, purchaseDate, notes, id, userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Investment not found' }, { status: 404 });
    }

    return NextResponse.json({ investment: result.rows[0] });
  } catch (error) {
    console.error('Update investment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: ParamsPromise) {
  try {
    const { id } = await context.params;
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    const userId = payload.userId;

    const result = await query(
      `DELETE FROM investments WHERE id = $1 AND user_id = $2 RETURNING id`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Investment not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Investment deleted successfully' });
  } catch (error) {
    console.error('Delete investment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
