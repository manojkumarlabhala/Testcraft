import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server-client"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")
    const subject = searchParams.get("subject")
    const examBoard = searchParams.get("examBoard")

    // Build query for test attempts
    let query = supabase
      .from("test_attempts")
      .select(`
        id,
        score,
        correct_answers,
        total_questions,
        time_spent,
        completed_at,
        mock_tests (
          id,
          title,
          subject,
          exam_board,
          class,
          category,
          difficulty
        )
      `)
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters if provided
    if (subject) {
      query = query.eq("mock_tests.subject", subject)
    }
    if (examBoard) {
      query = query.eq("mock_tests.exam_board", examBoard)
    }

    const { data: attempts, error } = await query

    if (error) {
      console.error("Error fetching test history:", error)
      return NextResponse.json({ error: "Failed to fetch test history" }, { status: 500 })
    }

    // Get total count for pagination
    const { count, error: countError } = await supabase
      .from("test_attempts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)

    if (countError) {
      console.error("Error fetching count:", countError)
    }

    // Calculate statistics
    const stats = {
      totalTests: count || 0,
      averageScore: attempts && attempts.length > 0
        ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.score, 0) / attempts.length)
        : 0,
      totalTimeSpent: attempts
        ? attempts.reduce((sum, attempt) => sum + (attempt.time_spent || 0), 0)
        : 0,
      bestScore: attempts && attempts.length > 0
        ? Math.max(...attempts.map(attempt => attempt.score))
        : 0,
      recentAverage: attempts && attempts.length >= 5
        ? Math.round(attempts.slice(0, 5).reduce((sum, attempt) => sum + attempt.score, 0) / 5)
        : null,
    }

    return NextResponse.json({
      attempts: attempts || [],
      stats,
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit,
      },
    })
  } catch (error) {
    console.error("Error in test history API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}