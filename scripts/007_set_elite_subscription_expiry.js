const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setEliteSubscriptionExpiry() {
  try {
    console.log('Setting subscription expiry for elite users...');

    // First, let's check if subscription_expires_at column exists
    // If not, we'll just update the subscription_plan
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    // Try to update with subscription_expires_at first
    let { data, error } = await supabase
      .from('profiles')
      .update({
        subscription_expires_at: expiryDate.toISOString(),
        subscription_plan: 'Student Elite'
      })
      .eq('subscription_plan', 'elite');

    if (error && error.message.includes('subscription_expires_at')) {
      console.log('subscription_expires_at column not found, updating subscription_plan only...');
      // If column doesn't exist, just update the plan
      const { data: data2, error: error2 } = await supabase
        .from('profiles')
        .update({
          subscription_plan: 'Student Elite'
        })
        .eq('subscription_plan', 'elite');

      if (error2) {
        console.error('Error updating elite subscriptions:', error2);
      } else {
        console.log('Successfully updated elite user subscriptions (plan only)');
        console.log('Updated records:', data2);
      }
    } else if (error) {
      console.error('Error updating elite subscriptions:', error);
    } else {
      console.log('Successfully updated elite user subscriptions with expiry date');
      console.log('Updated records:', data);
    }
  } catch (err) {
    console.error('Exception:', err);
  }
}

setEliteSubscriptionExpiry();