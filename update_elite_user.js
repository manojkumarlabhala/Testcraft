require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateUser() {
  console.log('Finding user by email...');
  const { data: authUser, error: authError } = await supabase.auth.admin.getUserByEmail('student.elite@testcraft.in');

  if (authError) {
    console.error('Auth error:', authError);
    return;
  }

  if (!authUser.user) {
    console.error('User not found');
    return;
  }

  console.log('User ID:', authUser.user.id);

  const { data, error } = await supabase
    .from('profiles')
    .update({ subscription_plan: 'Student Elite' })
    .eq('id', authUser.user.id);

  if (error) {
    console.error('Update error:', error);
  } else {
    console.log('Successfully updated subscription plan');
  }
}

updateUser().catch(console.error);
