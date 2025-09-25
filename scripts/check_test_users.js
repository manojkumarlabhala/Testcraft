require('dotenv').config({ path: '.env.local' });
const { createServerClient } = require("../lib/supabase/server-client");

async function checkTestUsers() {
  const supabase = createServerClient();

  try {
    // Get all users
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      console.error('Error listing users:', listError);
      return;
    }

    console.log(`Found ${users.users.length} users:`);

    for (const user of users.users) {
      const email = user.email;
      const metadataPlan = user.user_metadata?.subscription_plan || 'none';
      const role = user.user_metadata?.role || 'none';

      // Get profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('subscription_plan, subscription_expires_at')
        .eq('id', user.id)
        .single();

      const profilePlan = profile?.subscription_plan || 'none';
      const expiresAt = profile?.subscription_expires_at || 'none';

      console.log(`Email: ${email}`);
      console.log(`  Role: ${role}`);
      console.log(`  Metadata Plan: ${metadataPlan}`);
      console.log(`  Profile Plan: ${profilePlan}`);
      console.log(`  Expires At: ${expiresAt}`);
      console.log('---');
    }
  } catch (err) {
    console.error('Exception:', err);
  }
}

checkTestUsers().catch(console.error);
