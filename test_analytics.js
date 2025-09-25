require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testAnalyticsFunctions() {
  console.log('Testing analytics functions...');

  try {
    // Test get_user_stats
    const { data: userStats, error: userError } = await supabase.rpc('get_user_stats', {
      start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      end_date: new Date().toISOString()
    });

    if (userError) {
      console.error('get_user_stats error:', userError.message);
      return false;
    }

    console.log('✅ get_user_stats works:', userStats);

    // Test get_test_stats
    const { data: testStats, error: testError } = await supabase.rpc('get_test_stats', {
      start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      end_date: new Date().toISOString()
    });

    if (testError) {
      console.error('get_test_stats error:', testError.message);
      return false;
    }

    console.log('✅ get_test_stats works:', testStats);

    return true;
  } catch (err) {
    console.error('Exception:', err.message);
    return false;
  }
}

async function createAnalyticsFunctions() {
  console.log('Creating analytics functions...');

  const fs = require('fs');
  const sql = fs.readFileSync('./scripts/003_create_analytics_functions.sql', 'utf8');

  try {
    // Split the SQL into individual statements
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);

    for (const statement of statements) {
      if (statement.trim()) {
        console.log('Executing:', statement.substring(0, 50) + '...');
        const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' });
        if (error) {
          console.error('Error executing statement:', error);
        }
      }
    }

    console.log('✅ Analytics functions created');
    return true;
  } catch (err) {
    console.error('Exception creating functions:', err);
    return false;
  }
}

async function main() {
  const functionsExist = await testAnalyticsFunctions();

  if (!functionsExist) {
    console.log('Analytics functions missing, creating them...');
    await createAnalyticsFunctions();

    // Test again
    await testAnalyticsFunctions();
  } else {
    console.log('✅ All analytics functions are working');
  }
}

main();
