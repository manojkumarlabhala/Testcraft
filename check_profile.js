const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUserProfile() {
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

    // Get the profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error getting profile:', profileError);
    } else {
      console.log('User profile:', profile);
    }
  } catch (err) {
    console.error('Exception:', err);
  }
}

checkUserProfile();
