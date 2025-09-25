import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server-client"
import { isSuperAdmin } from "@/lib/admin/super-admin-emails"

export async function GET() {
  try {
  const supabase = createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !isSuperAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

    // Get overall platform statistics. Wrap exam_papers call in try/catch because table may be missing.
    const usersResult = await supabase.from("profiles").select("id", { count: "exact" })
    let papersResult: any = { count: 0 }
    try {
      papersResult = await supabase.from("exam_papers").select("id", { count: "exact" })
    } catch (err) {
      console.error("exam_papers table might be missing:", err)
      papersResult = { count: 0 }
    }

    const testsResult = await supabase.from("mock_tests").select("id", { count: "exact" })
    const downloadsResult = await supabase.from("user_downloads").select("id", { count: "exact" })

    // Get popular papers
    const { data: popularPapers } = await supabase.rpc("get_popular_papers", { limit_count: 10 })

    // Get recent activity
    const { data: recentActivity } = await supabase
      .from("analytics")
      .select("event_type, event_data, created_at")
      .order("created_at", { ascending: false })
      .limit(20)

    return NextResponse.json({
      stats: {
        totalUsers: usersResult.count || 0,
        totalPapers: papersResult.count || 0,
        totalTests: testsResult.count || 0,
        totalDownloads: downloadsResult.count || 0,
      },
      popularPapers: popularPapers || [],
      recentActivity: recentActivity || [],
    })
  } catch (error) {
    console.error("Admin stats error:", error)
    return NextResponse.json({ error: "Failed to fetch admin stats" }, { status: 500 })
  }
}
