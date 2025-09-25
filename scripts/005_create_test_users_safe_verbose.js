require('dotenv').config({ path: '.env.local' });
const { createServerClient } = require("../lib/supabase/server-client");

async function createTestUsers() {
  const supabase = createServerClient();

  // Helper to check if user exists
  async function userExists(email) {
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) {
      console.error(`Error listing users:`, error.message);
      return false;
    }
    return data.users.some(u => u.email === email);
  }

  // Helper to create user safely and log full error
  async function createUser(email, password, metadata) {
    if (await userExists(email)) {
      console.log(`User already exists: ${email}`);
      return;
    }
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: metadata
      });
      if (error) {
        console.error(`Error creating user ${email}:`, error);
      } else {
        console.log(`User created: ${email}`);
      }
    } catch (err) {
      console.error(`Exception for user ${email}:`, err);
    }
  }

  await createUser("student.premium@testcraft.in", "TestPremium@123", { role: "student", subscription_plan: "premium" });
  await createUser("student.elite@testcraft.in", "TestElite@123", { role: "student", subscription_plan: "elite" });
  await createUser("institution@testcraft.in", "TestInstitution@123", { role: "institution", subscription_plan: "premium" });

  console.log("Test user creation complete.");
}

createTestUsers().catch(console.error);
