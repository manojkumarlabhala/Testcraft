require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTestUser() {
  console.log('Checking test user subscription status...');

  try {
    // Find the test user
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserByEmail('student.elite@testcraft.in');

    if (authError || !authUser.user) {
      console.error('User not found:', authError);
      return;
    }

    console.log('User ID:', authUser.user.id);

    // Get profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.user.id)
      .single();

    if (profileError) {
      console.error('Profile error:', profileError);
      return;
    }

    console.log('Current profile:', profile);

    // Check if plan is correct
    if (profile.subscription_plan !== 'Student Elite') {
      console.log('❌ Plan is not Student Elite, updating...');

      const { data: updateData, error: updateError } = await supabase
        .from('profiles')
        .update({ subscription_plan: 'Student Elite' })
        .eq('id', authUser.user.id);

      if (updateError) {
        console.error('Update error:', updateError);
      } else {
        console.log('✅ Successfully updated to Student Elite');
      }
    } else {
      console.log('✅ Plan is already Student Elite');
    }

  } catch (err) {
    console.error('Exception:', err);
  }
}

checkTestUser();
