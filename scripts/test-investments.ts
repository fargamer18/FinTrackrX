import 'dotenv/config';
import { query } from '../lib/db';

async function testInvestmentsAPI() {
  try {
    console.log('🧪 Testing investments functionality...');
    
    // Test 1: Check if we can query the investments table
    console.log('\n1️⃣ Testing database query...');
    const result = await query('SELECT COUNT(*) as count FROM investments');
    console.log('✅ Investments table query successful. Row count:', result.rows[0].count);
    
    // Test 2: Try to fetch investments for a test user
    console.log('\n2️⃣ Testing user-specific query...');
    const userResult = await query(`
      SELECT 
        id, symbol, name, quantity, purchase_price, purchase_date, 
        current_price, currency, exchange, notes, created_at, updated_at
      FROM investments 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `, ['00000000-0000-0000-0000-000000000000']); // Dummy UUID
    console.log('✅ User investments query successful. Found:', userResult.rows.length, 'investments');
    
    // Test 3: Test portfolio calculation
    console.log('\n3️⃣ Testing portfolio calculation...');
    let totalValue = 0;
    let totalCost = 0;
    const investments = userResult.rows.map(inv => {
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
    
    const portfolio = {
      totalValue,
      totalCost,
      totalGain: totalValue - totalCost,
      totalGainPercent: totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0
    };
    
    console.log('✅ Portfolio calculation successful:', portfolio);
    console.log('✅ All tests passed! Investments functionality should work.');
    
  } catch (error) {
    console.error('❌ Test failed:', error instanceof Error ? error.message : String(error));
    console.error('Full error:', error);
  }
}

testInvestmentsAPI();