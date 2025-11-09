import { NextRequest, NextResponse } from 'next/server';
import { searchIndianInvestments } from '@/lib/indian-stock-api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    console.log('🔍 Indian stock search API called with query:', query);

    if (!query || query.length < 1) {
      console.log('❌ Query too short or empty');
      return NextResponse.json({ results: [] });
    }

    console.log('📡 Calling searchIndianInvestments...');
    const results = await searchIndianInvestments(query);
    console.log('📦 Indian API results count:', results?.length || 0);
    console.log('📦 First few results:', results?.slice(0, 3));
    
    // Results are already filtered and formatted
    console.log('✅ Final results count:', results.length);
    console.log('✅ Final results:', results);
    
    return NextResponse.json({ results });
  } catch (error) {
    console.error('❌ Indian stock search error:', error);
    return NextResponse.json({ error: 'Failed to search Indian investments' }, { status: 500 });
  }
}