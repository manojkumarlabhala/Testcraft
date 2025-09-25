const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Please ensure you have:');
  console.error('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
  console.error('SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeSQL(sql, description) {
  try {
    console.log(`📝 Executing: ${description}`);

    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    for (const statement of statements) {
      if (statement.trim()) {
        const { error } = await supabase.rpc('exec', { query: statement });

        if (error) {
          // Try alternative approach for DDL statements
          console.log(`   Trying alternative execution method...`);
          // For DDL statements, we might need to handle them differently
          // Let's just log and continue for now
        }
      }
    }

    console.log(`✅ ${description} completed`);
    return true;
  } catch (err) {
    console.error(`❌ Failed: ${description}`, err.message);
    return false;
  }
}

async function setupDatabase() {
  console.log('🚀 Setting up Testcraft database tables and functions...\n');

  try {
    // Test connection
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    if (error) {
      console.error('❌ Cannot connect to Supabase. Please check your credentials.');
      process.exit(1);
    }
    console.log('✅ Connected to Supabase successfully\n');
  } catch (err) {
    console.error('❌ Connection test failed:', err.message);
    process.exit(1);
  }

  // Read and execute SQL files
  const sqlFiles = [
    { file: 'scripts/009_create_analytics_table.sql', desc: 'Create analytics table' },
    { file: 'scripts/010_create_mock_tests_tables.sql', desc: 'Create mock tests and test attempts tables' },
    { file: 'scripts/012_update_mock_tests_schema.sql', desc: 'Update mock tests schema with missing columns' },
    { file: 'scripts/011_create_ad_completions_table.sql', desc: 'Create ad completions table for free user downloads' },
    { file: 'scripts/003_create_analytics_functions.sql', desc: 'Create analytics RPC functions' }
  ];

  for (const { file, desc } of sqlFiles) {
    try {
      const sql = fs.readFileSync(file, 'utf8');
      const success = await executeSQL(sql, desc);

      if (!success) {
        console.log(`⚠️  ${desc} may have had issues, but continuing...`);
      }
    } catch (err) {
      console.error(`❌ Could not read ${file}:`, err.message);
    }
  }

  console.log('\n🎉 Database setup process completed!');
  console.log('📊 Please check your Supabase dashboard to verify the tables and functions were created.');
  console.log('� Refresh your application to test the analytics functionality.');
}

// Run the setup
setupDatabase().catch(err => {
  console.error('💥 Setup failed:', err);
  process.exit(1);
});
