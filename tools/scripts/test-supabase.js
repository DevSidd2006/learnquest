// Simple test script to verify Supabase connection
// Run with: node scripts/test-supabase.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials not found in .env file');
  console.log('Please add SUPABASE_URL and SUPABASE_ANON_KEY to your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('🔍 Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('learning_sessions')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      console.log('\nTroubleshooting:');
      console.log('1. Check your SUPABASE_URL and SUPABASE_ANON_KEY');
      console.log('2. Ensure you ran the database migration');
      console.log('3. Check RLS policies in Supabase dashboard');
      return;
    }
    
    console.log('✅ Supabase connection successful!');
    console.log(`📊 Found ${data || 0} learning sessions in database`);
    
    // Test table structure
    const { data: tables, error: tableError } = await supabase
      .rpc('get_table_names');
    
    if (!tableError && tables) {
      console.log('📋 Available tables:', tables);
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }
}

testConnection();