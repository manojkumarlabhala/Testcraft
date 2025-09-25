require('dotenv').config({ path: '.env.local' });
const { createServerClient } = require("../lib/supabase/server-client");

async function createSuperAdmin() {
  console.log('Environment variables:');
  console.log('NEXT_PUBLIC_SUPER_ADMIN_EMAILS:', process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAILS);
  console.log('NEXT_PUBLIC_SUPER_ADMIN_PASSWORD:', process.env.NEXT_PUBLIC_SUPER_ADMIN_PASSWORD ? '***' : 'not set');

  const supabase = createServerClient();

  const superAdminEmail = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAILS || "superadmin@testcraft.in";
  const superAdminPassword = process.env.NEXT_PUBLIC_SUPER_ADMIN_PASSWORD || "Superadmin@123";

  console.log(`Creating super admin user: ${superAdminEmail}`);

  try {
    // Check if user already exists
    console.log('Checking existing users...');
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      console.error('Error listing users:', listError);
      return;
    }

    console.log(`Found ${existingUsers.users.length} existing users`);
    const userExists = existingUsers.users.some(u => u.email === superAdminEmail);
    console.log(`Super admin user exists: ${userExists}`);

    if (userExists) {
      console.log(`Super admin user already exists: ${superAdminEmail}`);
      return;
    }

    console.log('Creating super admin user...');
    // Create the super admin user
    const { data, error } = await supabase.auth.admin.createUser({
      email: superAdminEmail,
      password: superAdminPassword,
      email_confirm: true,
      user_metadata: {
        role: "super_admin",
        subscription_plan: "elite"
      }
    });

    if (error) {
      console.error(`Error creating super admin user:`, error);
    } else {
      console.log(`Super admin user created successfully: ${superAdminEmail}`);
      console.log('User ID:', data.user.id);

      // Create profile entry
      console.log('Creating profile entry...');
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: superAdminEmail,
          full_name: "Super Administrator",
          role: "super_admin",
          subscription_plan: "elite",
          is_active: true
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
      } else {
        console.log('Super admin profile created successfully');
      }
    }
  } catch (err) {
    console.error('Exception creating super admin:', err);
  }
}

createSuperAdmin().catch(console.error);
