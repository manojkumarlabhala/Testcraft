const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addSubscriptionExpiryColumn() {
  try {
    console.log('Setting expiry dates for Student Elite users...');

    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 1 year from now

    console.log('Expiry date will be set to:', expiryDate.toISOString());

    // First, try to update existing Student Elite users
    const { data, error } = await supabase
      .from('profiles')
      .update({
        subscription_expires_at: expiryDate.toISOString()
      })
      .eq('subscription_plan', 'Student Elite')
      .select('id, email, subscription_plan, subscription_expires_at');

    if (error) {
      console.error('Error setting expiry dates:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
    } else {
      console.log('Successfully set expiry dates for Student Elite users');
      console.log('Updated records:', data);
      console.log('Number of records updated:', data?.length || 0);
    }

    // Also check if there are any users with subscription_plan in user metadata
    console.log('Checking for users with elite plan in metadata...');
    const { data: allProfiles, error: fetchError } = await supabase
      .from('profiles')
      .select('id, email, subscription_plan, subscription_expires_at')
      .eq('subscription_plan', 'Student Elite');

    if (fetchError) {
      console.error('Error fetching profiles:', fetchError);
    } else {
      console.log('Current Student Elite profiles:');
      allProfiles?.forEach(profile => {
        console.log(`- ${profile.email}: expires_at = ${profile.subscription_expires_at}`);
      });
    }

  } catch (err) {
    console.error('Exception:', err);
  }
}

addSubscriptionExpiryColumn();
