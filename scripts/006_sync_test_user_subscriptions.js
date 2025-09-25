require('dotenv').config({ path: '.env.local' });
const { createServerClient } = require("../lib/supabase/server-client");

async function syncTestUserSubscriptions() {
  const supabase = createServerClient();

  try {
    // Get all users
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      console.error('Error listing users:', listError);
      return;
    }

    console.log(`Found ${users.users.length} users`);

    for (const user of users.users) {
      const email = user.email;
      const subscriptionPlan = user.user_metadata?.subscription_plan || 'free';

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ subscription_plan: subscriptionPlan })
        .eq('id', user.id);

      if (updateError) {
        console.error(`Error updating profile for ${email}:`, updateError);
      } else {
        console.log(`Updated ${email} with subscription: ${subscriptionPlan}`);
      }
    }

    console.log('Subscription sync complete.');
  } catch (err) {
    console.error('Exception:', err);
  }
}

syncTestUserSubscriptions().catch(console.error);
