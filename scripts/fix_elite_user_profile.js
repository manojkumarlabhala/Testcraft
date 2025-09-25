const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixEliteUserProfile() {
  try {
    const testUserEmail = 'student.elite@testcraft.in';

    console.log(`Checking profile for ${testUserEmail}...`);

    // First, get the user ID from auth.users
    const { data: userData, error: userError } = await supabase.auth.admin.getUserByEmail(testUserEmail);

    if (userError || !userData.user) {
      console.error('Error finding user:', userError);
      return;
    }

    const userId = userData.user.id;
    console.log(`Found user ID: ${userId}`);

    // Check if profile exists
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (existingProfile) {
      console.log('Profile already exists:', existingProfile);
      return;
    }

    console.log('Profile does not exist, creating it...');

    // Create the profile
    const { data: newProfile, error: createError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: testUserEmail,
        subscription_plan: 'Student Elite',
        full_name: 'Student Elite User'
      });

    if (createError) {
      console.error('Error creating profile:', createError);
    } else {
      console.log('Successfully created profile:', newProfile);
    }
  } catch (err) {
    console.error('Exception:', err);
  }
}

fixEliteUserProfile();
