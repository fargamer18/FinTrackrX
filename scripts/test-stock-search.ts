// Simple test to check stock search functionality

// Set environment variable manually
process.env.FINNHUB_API_KEY = 'd487ge1r01qk80bjptfgd487ge1r01qk80bjptg0';

import { searchSymbol } from '../lib/finnhub';

async function testStockSearch() {
  console.log('Testing stock search...');
  console.log('API Key:', process.env.FINNHUB_API_KEY ? 'Set' : 'Not set');
  
  try {
    console.log('Testing direct Finnhub searchSymbol function:');
    const results = await searchSymbol('Apple');
    console.log('Results:', results);
    
    if (results && results.length > 0) {
      console.log('✅ Direct Finnhub search works!');
      
      // Test filtering
      const filtered = results
        .filter((result: any) => 
          result.type === 'Common Stock' || 
          result.type === 'ETF' || 
          result.type === 'Mutual Fund'
        )
        .slice(0, 10);
      
      console.log('✅ Filtered results:', filtered);
    } else {
      console.log('❌ No results returned');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testStockSearch();