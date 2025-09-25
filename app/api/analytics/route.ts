import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get("timeRange") || "30d"

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      console.error("Analytics auth error:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("Analytics request for user:", user.id, "timeRange:", timeRange)

    // Calculate date range
    const now = new Date()
    const daysBack = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : timeRange === "90d" ? 90 : 365
    const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000)

    // Get basic analytics data directly from tables (simplified approach)
    try {
      console.log("Fetching analytics data for user:", user.id)

      // Get user's test attempts for the time range
      const { data: testAttempts, error: attemptsError } = await supabase
        .from('test_attempts')
        .select(`
          percentage,
          completed_at,
          mock_tests(subject)
        `)
        .eq('user_id', user.id)
        .eq('is_completed', true)
        .gte('completed_at', startDate.toISOString())
        .lte('completed_at', now.toISOString())
        .order('completed_at', { ascending: false })

      if (attemptsError) {
        console.error("Error fetching test attempts:", attemptsError)
      }

      // Calculate basic stats from test attempts
      const attempts = testAttempts || []
      const totalTests = attempts.length
      const averageScore = totalTests > 0 ? attempts.reduce((sum, attempt) => sum + (attempt.percentage || 0), 0) / totalTests : 0

      // Group by subject for subject performance
      const subjectMap = new Map()
      attempts.forEach((attempt: any) => {
        const subject = attempt.mock_tests?.subject || 'Unknown'
        if (!subjectMap.has(subject)) {
          subjectMap.set(subject, { total: 0, count: 0 })
        }
        const subjectData = subjectMap.get(subject)
        subjectData.total += attempt.percentage || 0
        subjectData.count += 1
      })

      const subjectPerformance = Array.from(subjectMap.entries()).map(([subject, data]) => ({
        subject,
        score: data.count > 0 ? data.total / data.count : 0
      }))

      // Create weekly activity data (last 7 days)
      const weeklyActivity = []
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        const dayStart = new Date(date)
        dayStart.setHours(0, 0, 0, 0)
        const dayEnd = new Date(date)
        dayEnd.setHours(23, 59, 59, 999)

        const dayTests = attempts.filter(attempt => {
          const attemptDate = new Date(attempt.completed_at)
          return attemptDate >= dayStart && attemptDate <= dayEnd
        }).length

        weeklyActivity.push({
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          tests: dayTests
        })
      }

      console.log("Analytics data calculated:", {
        totalTests,
        averageScore,
        subjectPerformanceCount: subjectPerformance.length,
        weeklyActivityCount: weeklyActivity.length
      })

      return NextResponse.json({
        userStats: {
          totalUsers: 1,
          activeUsers: 1,
          newUsers: 0,
          premiumUsers: 1,
        },
        testStats: {
          totalTests,
          testsCompleted: totalTests,
          averageScore: Math.round(averageScore * 100) / 100,
          totalQuestions: 0,
        },
        performanceData: weeklyActivity,
        subjectPerformance,
        monthlyActivity: [],
        topPerformers: [],
      })
    } catch (functionError) {
      console.log("Error in analytics calculation, using basic data:", functionError)

      // Fallback: Return basic data structure
      return NextResponse.json({
        userStats: {
          totalUsers: 1,
          activeUsers: 1,
          newUsers: 0,
          premiumUsers: 1,
        },
        testStats: {
          totalTests: 0,
          testsCompleted: 0,
          averageScore: 0,
          totalQuestions: 0,
        },
        performanceData: [],
        subjectPerformance: [],
        monthlyActivity: [],
        topPerformers: [],
      })
    }
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { eventType, eventData } = await request.json()
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { error } = await supabase.from("analytics").insert({
      user_id: user.id,
      event_type: eventType,
      event_data: eventData,
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json({ error: "Failed to record analytics" }, { status: 500 })
  }
}
