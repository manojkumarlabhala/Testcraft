require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkAnalyticsFunctions() {
  console.log('🔍 Checking if analytics functions exist...\n');

  const functions = [
    'get_user_stats',
    'get_test_stats',
    'get_performance_data',
    'get_subject_performance',
    'get_monthly_activity',
    'get_top_performers'
  ];

  for (const funcName of functions) {
    try {
      // Try to call each function with dummy parameters
      let result;
      if (funcName === 'get_performance_data' || funcName === 'get_subject_performance') {
        // These need a user_id parameter
        result = await supabase.rpc(funcName, {
          start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          end_date: new Date().toISOString(),
          user_id: '00000000-0000-0000-0000-000000000000' // dummy UUID
        });
      } else {
        result = await supabase.rpc(funcName, {
          start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          end_date: new Date().toISOString()
        });
      }

      if (result.error) {
        console.log(`❌ ${funcName}: ${result.error.message}`);
      } else {
        console.log(`✅ ${funcName}: Available`);
      }
    } catch (err) {
      console.log(`❌ ${funcName}: ${err.message}`);
    }
  }

  console.log('\n💡 If functions are missing, run the creation script.');
}

checkAnalyticsFunctions();
