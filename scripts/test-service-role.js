const { createClient } = require('@supabase/supabase-js');

// Directly set the service role key and URL
const supabaseUrl = 'https://rokfqlkuzwmguruybfje.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJva2ZxbGt1endtZ3VydXliZmplIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODE5MjUzNiwiZXhwIjoyMDczNzY4NTM2fQ.QWNL6l2roAib824lROqZzu9wYjYqPnarpdQsyRnC8Eg';

async function updateRLSPolicies() {
  console.log('Updating RLS policies for profiles table...');
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    // Add service role policies for profiles table
    const policies = [
      `DROP POLICY IF EXISTS "profiles_insert_service_role" ON public.profiles;`,
      `DROP POLICY IF EXISTS "profiles_update_service_role" ON public.profiles;`,
      `DROP POLICY IF EXISTS "profiles_delete_service_role" ON public.profiles;`,
      `CREATE POLICY "profiles_insert_service_role" ON public.profiles FOR INSERT WITH CHECK (auth.role() = 'service_role');`,
      `CREATE POLICY "profiles_update_service_role" ON public.profiles FOR UPDATE USING (auth.role() = 'service_role');`,
      `CREATE POLICY "profiles_delete_service_role" ON public.profiles FOR DELETE USING (auth.role() = 'service_role');`
    ];

    for (const policy of policies) {
      console.log('Executing:', policy);
      const { error } = await supabase.rpc('exec_sql', { sql: policy });
      if (error) {
        console.error('Error executing policy:', error);
      } else {
        console.log('Policy executed successfully');
      }
    }

    console.log('RLS policies updated successfully');
  } catch (err) {
    console.error('Exception:', err);
  }
}

async function testServiceRole() {
  console.log('Testing service role client...');
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    // Try to list users (service role should be able to do this)
    console.log('Testing admin.listUsers...');
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) {
      console.error('Service role test failed:', error);
    } else {
      console.log('Service role works! Found', data.users.length, 'users');
    }

    // Also try to insert a test profile to see if RLS is bypassed
    console.log('Testing profile creation with service role...');
    const testUserId = 'test-user-id-' + Date.now();
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: testUserId,
        email: 'test@example.com',
        subscription_plan: 'free'
      })
      .select();

    if (profileError) {
      console.error('Profile creation test failed:', profileError);
    } else {
      console.log('Profile creation successful:', profileData);
      // Clean up the test profile
      await supabase.from('profiles').delete().eq('id', testUserId);
      console.log('Test profile cleaned up');
    }
  } catch (err) {
    console.error('Exception:', err);
  }
}

async function main() {
  await updateRLSPolicies();
  await testServiceRole();
}

main();
