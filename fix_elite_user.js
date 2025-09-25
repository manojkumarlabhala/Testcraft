const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkAndFixProfile() {
  const testEmail = 'student.elite@testcraft.in';

  console.log(`Checking profile for ${testEmail}...`);

  // Get user by email
  const { data: userData, error: userError } = await supabase.auth.admin.getUserByEmail(testEmail);

  if (userError || !userData.user) {
    console.error('Error finding user:', userError);
    return;
  }

  const userId = userData.user.id;
  console.log('User ID:', userId);

  // Get current profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (profileError) {
    console.error('Error getting profile:', profileError);
    return;
  }

  console.log('Current profile:', profile);

  // Fix subscription plan if needed
  if (profile.subscription_plan !== 'Student Elite') {
    console.log('Fixing subscription plan to Student Elite...');

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        subscription_plan: 'Student Elite',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating profile:', updateError);
    } else {
      console.log('✅ Successfully updated subscription plan to Student Elite');
    }
  } else {
    console.log('✅ Subscription plan is already correct');
  }
}

checkAndFixProfile().catch(console.error);
