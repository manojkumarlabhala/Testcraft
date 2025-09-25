import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server-client"
import { isSuperAdmin } from "@/lib/admin/super-admin-emails"

export async function GET(req: NextRequest) {
  const supabase = createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !isSuperAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  // In a real implementation, these would be database queries
  // For now, returning simulated data
  const platformStats = {
    totalUsers: 15420,
    totalInstitutions: 234,
    totalRevenue: 3456789.50, // Indian Rupees
    activeTests: 1567,
    communityPosts: 8943,
    premiumUsers: 2876,
    serverUptime: "99.9%",
    databaseSize: "2.4 GB",
    activeSessions: 1247,
    apiRequestsToday: 45200,
    retentionRate: 89.2,
    conversionRate: 18.7
  }

  // TODO: Replace with actual database queries like:
  /*
  const { data: usersCount } = await supabase
    .from('profiles')
    .select('id', { count: 'exact' })
  
  const { data: institutionsCount } = await supabase
    .from('institutions')
    .select('id', { count: 'exact' })
    
  const { data: premiumUsersCount } = await supabase
    .from('profiles')
    .select('id', { count: 'exact' })
    .in('subscription_tier', ['Student Elite', 'Student Premium'])
  */

  return NextResponse.json(platformStats)
}