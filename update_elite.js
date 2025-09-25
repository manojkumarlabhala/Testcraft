const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function fixUser() {
  console.log('Fixing Student Elite user...');

  const { data: userData, error: userError } = await supabase.auth.admin.getUserByEmail('student.elite@testcraft.in');

  if (userError || !userData?.user) {
    console.error('User not found:', userError);
    return;
  }

  const userId = userData.user.id;
  console.log('User ID:', userId);

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ subscription_plan: 'Student Elite' })
    .eq('id', userId);

  if (updateError) {
    console.error('Update error:', updateError);
  } else {
    console.log('✅ Successfully updated to Student Elite');
  }
}

fixUser().catch(console.error);
