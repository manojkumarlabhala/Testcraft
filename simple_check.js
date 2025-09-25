const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function checkProfile() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  try {
    // Get user by email
    const { data: userData, error: userError } = await supabase.auth.admin.getUserByEmail('student.elite@testcraft.in');

    if (userError || !userData?.user) {
      console.log('User error:', userError);
      return;
    }

    console.log('User ID:', userData.user.id);

    // Get profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userData.user.id)
      .single();

    if (profileError) {
      console.log('Profile error:', profileError);
      return;
    }

    console.log('Profile:', JSON.stringify(profile, null, 2));

    // Check if subscription_plan matches what AI chat expects
    const expectedPlan = 'Student Elite';
    const actualPlan = profile.subscription_plan;
    const hasAccess = actualPlan === expectedPlan;

    console.log(`Expected plan: "${expectedPlan}"`);
    console.log(`Actual plan: "${actualPlan}"`);
    console.log(`Has AI chat access: ${hasAccess ? 'YES' : 'NO'}`);

  } catch (error) {
    console.log('Error:', error);
  }
}

checkProfile();
