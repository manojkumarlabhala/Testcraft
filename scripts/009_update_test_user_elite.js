const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateTestUserSubscription() {
  try {
    const testUserEmail = 'student.elite@testcraft.in';
    const newPlan = 'Student Elite';

    console.log(`Updating subscription plan for ${testUserEmail} to ${newPlan}...`);

    // First, get the user ID from auth.users
    const { data: userData, error: userError } = await supabase.auth.admin.getUserByEmail(testUserEmail);

    if (userError || !userData.user) {
      console.error('Error finding user:', userError);
      return;
    }

    const userId = userData.user.id;
    console.log(`Found user ID: ${userId}`);

    // Update the profile
    const { data, error } = await supabase
      .from('profiles')
      .update({
        subscription_plan: newPlan,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      console.error('Error updating profile:', error);
    } else {
      console.log(`Successfully updated subscription plan to ${newPlan} for ${testUserEmail}`);
      console.log('Updated records:', data);
    }
  } catch (err) {
    console.error('Exception:', err);
  }
}

updateTestUserSubscription();
