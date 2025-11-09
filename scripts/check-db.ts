import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:Mfkmfk123@localhost:5432/fintrackrx",
});

async function checkAndSetupDatabase() {
  try {
    console.log('🔍 Checking database schema...');
    
    // Check if investments table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'investments'
      );
    `);
    
    const investmentsTableExists = tableCheck.rows[0].exists;
    
    if (!investmentsTableExists) {
      console.log('❌ Investments table not found. Running schema setup...');
      
      // Read and execute schema.sql
      const schemaPath = path.join(__dirname, '../database/schema.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      
      await pool.query(schema);
      console.log('✅ Database schema applied successfully!');
    } else {
      console.log('✅ Investments table already exists.');
    }
    
    // List all tables
    const tables = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('📋 Available tables:');
    tables.rows.forEach(row => console.log('  -', row.table_name));
    
    // Test investments table structure
    const columnsCheck = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'investments' 
      ORDER BY ordinal_position;
    `);
    
    if (columnsCheck.rows.length > 0) {
      console.log('📊 Investments table columns:');
      columnsCheck.rows.forEach(row => console.log(`  - ${row.column_name}: ${row.data_type}`));
    }
    
  } catch (error) {
    console.error('❌ Database setup failed:', error instanceof Error ? error.message : String(error));
  } finally {
    await pool.end();
  }
}

checkAndSetupDatabase();