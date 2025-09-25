const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkEliteUser() {
  console.log('🔍 Checking Elite User Status...\n');

  try {
    // Get the elite user
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserByEmail('student.elite@testcraft.in');

    if (authError || !authUser.user) {
      console.error('❌ Elite user not found:', authError);
      fs.writeFileSync('elite_check_result.txt', '❌ Elite user not found: ' + JSON.stringify(authError));
      return;
    }

    console.log('✅ Elite user found:', authUser.user.id);

    // Check profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.user.id)
      .single();

    if (profileError) {
      console.error('❌ Profile error:', profileError);
      fs.writeFileSync('elite_check_result.txt', '❌ Profile error: ' + JSON.stringify(profileError));
      return;
    }

    console.log('📋 Profile data:');
    console.log(JSON.stringify(profile, null, 2));

    // Check subscription logic
    const now = new Date();
    const expiresAt = profile?.subscription_expires_at ? new Date(profile.subscription_expires_at) : null;
    const isActive = profile?.subscription_plan === 'Student Elite' || (expiresAt ? expiresAt > now : false);

    console.log('\n🔍 Subscription Analysis:');
    console.log('- Plan:', profile?.subscription_plan);
    console.log('- Expires At:', expiresAt);
    console.log('- Current Time:', now.toISOString());
    console.log('- Is Active:', isActive);
    console.log('- Chat Access:', profile?.subscription_plan === 'Student Elite' && isActive ? '✅ YES' : '❌ NO');

    // Test the API logic directly
    console.log('\n🧪 API Logic Test:');
    const apiResponse = {
      plan: profile?.subscription_plan || "free",
      expiresAt: profile?.subscription_expires_at,
      isActive,
      daysRemaining: expiresAt ? Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0,
    };

    console.log('API Response would be:', JSON.stringify(apiResponse, null, 2));

    // Check if chat API would allow access
    console.log('\n🤖 Chat API Access Check:');
    const chatAccess = profile?.subscription_plan === 'Student Elite';
    console.log('Chat API would allow access:', chatAccess ? '✅ YES' : '❌ NO');

    // Write results to file
    const result = {
      userFound: true,
      userId: authUser.user.id,
      profile: profile,
      subscriptionAnalysis: {
        plan: profile?.subscription_plan,
        expiresAt: expiresAt,
        isActive: isActive,
        chatAccess: profile?.subscription_plan === 'Student Elite' && isActive
      },
      apiResponse: apiResponse,
      chatApiAccess: chatAccess
    };

    fs.writeFileSync('elite_check_result.txt', JSON.stringify(result, null, 2));

  } catch (error) {
    console.error('💥 Error:', error);
    fs.writeFileSync('elite_check_result.txt', '💥 Error: ' + error.message);
  }
}

checkEliteUser();
