// Simple test to verify Indian stock API fallback functionality
const { searchIndianInvestments } = require('./lib/indian-stock-api.ts');

async function testSearch() {
  console.log('Testing Indian stock search fallback...');
  
  try {
    const results = await searchIndianInvestments('Reliance');
    console.log('Search results:', results);
    
    if (results.length > 0) {
      console.log('✅ Fallback working! Found', results.length, 'results');
      console.log('First result:', results[0]);
    } else {
      console.log('❌ No results returned');
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testSearch();