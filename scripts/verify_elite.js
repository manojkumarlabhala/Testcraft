require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing SUPABASE env vars in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function verify() {
  try {
    const testEmail = process.env.TEST_STUDENT_ELITE_EMAIL || 'student.elite@testcraft.in';

    // Find user in auth.users via admin API
    const { data: usersList, error: usersErr } = await supabase.auth.admin.listUsers();
    if (usersErr) {
      console.error('Failed to list users:', usersErr);
      process.exit(2);
    }

    const user = usersList.users.find(u => u.email === testEmail);
    if (!user) {
      console.error('Test user not found in auth:', testEmail);
      process.exit(3);
    }

    console.log('Found auth user id:', user.id);

    // Read profile
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (profileErr) {
      console.error('Failed to read profile:', profileErr);
      process.exit(4);
    }

    console.log('Profile:', profile);

    const plan = profile?.subscription_plan || 'free';
    if (plan === 'Student Elite') {
      console.log('✅ Test user subscription is Student Elite — verification passed');
      process.exit(0);
    } else {
      console.error('❌ Test user subscription is NOT Student Elite (', plan, ')');
      process.exit(5);
    }
  } catch (err) {
    console.error('Exception during verify:', err);
    process.exit(10);
  }
}

verify();
