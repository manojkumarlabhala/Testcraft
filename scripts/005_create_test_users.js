const { createServerClient } = require("../lib/supabase/server-client");

async function createTestUsers() {
  const supabase = createServerClient();

  // Student Premium
  await supabase.auth.admin.createUser({
    email: "student.premium@testcraft.in",
    password: "TestPremium@123",
    email_confirm: true,
    user_metadata: {
      role: "student",
      subscription_plan: "premium"
    }
  });

  // Student Elite
  await supabase.auth.admin.createUser({
    email: "student.elite@testcraft.in",
    password: "TestElite@123",
    email_confirm: true,
    user_metadata: {
      role: "student",
      subscription_plan: "elite"
    }
  });

  // Institutional
  await supabase.auth.admin.createUser({
    email: "institution@testcraft.in",
    password: "TestInstitution@123",
    email_confirm: true,
    user_metadata: {
      role: "institution",
      subscription_plan: "premium"
    }
  });

  console.log("Test users created.");
}

createTestUsers().catch(console.error);
