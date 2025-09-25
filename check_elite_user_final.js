const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

async function checkEliteUser() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  let output = '🔍 Checking Student Elite User...\n\n';

  try {
    // Get user by email
    const { data: userData, error: userError } = await supabase.auth.admin.getUserByEmail('student.elite@testcraft.in');

    if (userError || !userData?.user) {
      output += '❌ User not found: ' + JSON.stringify(userError) + '\n';
      fs.writeFileSync('elite_check_result.txt', output);
      return;
    }

    output += '✅ User found: ' + userData.user.id + '\n';
    output += '📧 Email: ' + userData.user.email + '\n';
    output += '📅 Created: ' + userData.user.created_at + '\n\n';

    // Get profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userData.user.id)
      .single();

    if (profileError) {
      output += '❌ Profile error: ' + JSON.stringify(profileError) + '\n';
      fs.writeFileSync('elite_check_result.txt', output);
      return;
    }

    output += '📋 Profile Data:\n';
    output += 'ID: ' + profile.id + '\n';
    output += 'Full Name: ' + (profile.full_name || 'Not set') + '\n';
    output += 'Email: ' + profile.email + '\n';
    output += 'Subscription Plan: ' + profile.subscription_plan + '\n';
    output += 'Subscription Expires: ' + (profile.subscription_expires_at || 'Never') + '\n';
    output += 'Created: ' + profile.created_at + '\n';
    output += 'Updated: ' + profile.updated_at + '\n\n';

    // Check subscription logic
    const now = new Date();
    const expiresAt = profile?.subscription_expires_at ? new Date(profile.subscription_expires_at) : null;
    const isActive = profile?.subscription_plan === 'Student Elite' || (expiresAt ? expiresAt > now : false);

    output += '🔍 Subscription Analysis:\n';
    output += '- Plan: ' + profile?.subscription_plan + '\n';
    output += '- Expires At: ' + expiresAt + '\n';
    output += '- Current Time: ' + now.toISOString() + '\n';
    output += '- Is Active: ' + isActive + '\n';
    output += '- AI Chat Access: ' + (profile?.subscription_plan === 'Student Elite' ? '✅ YES' : '❌ NO') + '\n\n';

    // Check if user has any test attempts
    const { data: testAttempts, error: testError } = await supabase
      .from('test_attempts')
      .select('id, percentage, completed_at')
      .eq('user_id', userData.user.id)
      .limit(5);

    output += '📊 Recent Test Attempts:\n';
    if (testError) {
      output += '❌ Error fetching tests: ' + JSON.stringify(testError) + '\n';
    } else if (testAttempts && testAttempts.length > 0) {
      testAttempts.forEach((test, index) => {
        output += `${index + 1}. Score: ${test.percentage}%, Completed: ${test.completed_at}\n`;
      });
    } else {
      output += 'No test attempts found\n';
    }

  } catch (error) {
    output += '💥 Error: ' + error.message + '\n';
  }

  fs.writeFileSync('elite_check_result.txt', output);
  console.log(output);
}

checkEliteUser();
