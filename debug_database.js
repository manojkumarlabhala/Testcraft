require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function debugDatabase() {
  console.log('=== DATABASE DEBUG ===');

  try {
    // Check if profiles table exists and has correct structure
    console.log('\n1. Checking profiles table structure...');
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (profilesError) {
      console.error('Profiles table error:', profilesError);
    } else {
      console.log('Profiles table exists, sample data:', profilesData);
    }

    // Check test user
    console.log('\n2. Checking test user...');
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserByEmail('student.elite@testcraft.in');

    if (authError) {
      console.error('Auth user error:', authError);
    } else if (!authUser.user) {
      console.error('Test user not found in auth');
    } else {
      console.log('Test user found:', authUser.user.id);

      // Check profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.user.id)
        .single();

      if (profileError) {
        console.error('Profile error:', profileError);
      } else {
        console.log('User profile:', profile);

        // Check if subscription is correct
        if (profile.subscription_plan !== 'Student Elite') {
          console.log('❌ Subscription plan is wrong, fixing...');
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ subscription_plan: 'Student Elite' })
            .eq('id', authUser.user.id);

          if (updateError) {
            console.error('Update error:', updateError);
          } else {
            console.log('✅ Fixed subscription plan');
          }
        } else {
          console.log('✅ Subscription plan is correct');
        }
      }
    }

    // Check analytics functions
    console.log('\n3. Checking analytics functions...');
    try {
      const { data: userStats, error: userStatsError } = await supabase.rpc('get_user_stats', {
        start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: new Date().toISOString()
      });

      if (userStatsError) {
        console.error('get_user_stats error:', userStatsError);
      } else {
        console.log('✅ get_user_stats works');
      }
    } catch (err) {
      console.error('get_user_stats exception:', err.message);
    }

  } catch (err) {
    console.error('Exception:', err);
  }
}

debugDatabase();
