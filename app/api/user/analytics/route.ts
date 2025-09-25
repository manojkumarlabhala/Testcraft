import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server-client"

export async function GET() {
  try {
  const supabase = createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Get user analytics using the RPC function
    const { data: analytics, error } = await supabase.rpc("get_user_analytics", {
      user_uuid: user.id,
    })

    if (error) throw error

    // Get recent test attempts for performance chart
    const { data: recentAttempts, error: attemptsError } = await supabase
      .from("user_test_attempts")
      .select("percentage, completed_at, mock_tests(title)")
      .eq("user_id", user.id)
      .eq("is_completed", true)
      .order("completed_at", { ascending: false })
      .limit(10)

    if (attemptsError) throw attemptsError

    return NextResponse.json({
      analytics: analytics?.[0] || {
        total_downloads: 0,
        total_attempts: 0,
        avg_score: 0,
        favorite_subjects: [],
      },
      recentAttempts: recentAttempts || [],
    })
  } catch (error) {
    console.error("Analytics fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
