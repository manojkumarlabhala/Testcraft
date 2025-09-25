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
    const timeframe = searchParams.get("timeframe") || "30d" // 7d, 30d, 90d, all

    // Calculate date range
    const now = new Date()
    let startDate: Date

    switch (timeframe) {
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(0) // All time
    }

    // Get test attempts within timeframe
    const { data: attempts, error: attemptsError } = await supabase
      .from("test_attempts")
      .select(`
        id,
        score,
        correct_answers,
        total_questions,
        time_spent,
        completed_at,
        mock_tests (
          subject,
          exam_board,
          category,
          difficulty
        )
      `)
      .eq("user_id", user.id)
      .gte("completed_at", startDate.toISOString())
      .order("completed_at", { ascending: true })

    if (attemptsError) {
      console.error("Error fetching performance data:", attemptsError)
      return NextResponse.json({ error: "Failed to fetch performance data" }, { status: 500 })
    }

    if (!attempts || attempts.length === 0) {
      return NextResponse.json({
        timeframe,
        totalTests: 0,
        averageScore: 0,
        scoreTrend: [],
        subjectPerformance: {},
        examBoardPerformance: {},
        timeManagement: { averageTime: 0, efficiency: 0 },
        improvementAreas: [],
      })
    }

    // Calculate overall statistics
    const totalTests = attempts.length
    const averageScore = Math.round(
      attempts.reduce((sum, attempt) => sum + attempt.score, 0) / totalTests
    )

    // Score trend over time
    const scoreTrend = attempts.map((attempt) => ({
      date: new Date(attempt.completed_at).toISOString().split('T')[0],
      score: attempt.score,
      subject: attempt.mock_tests?.[0]?.subject,
    }))

    // Subject-wise performance
    const subjectPerformance: Record<string, { total: number; correct: number; average: number; tests: number }> = {}
    attempts.forEach((attempt) => {
      const subject = attempt.mock_tests?.[0]?.subject || "Unknown"
      if (!subjectPerformance[subject]) {
        subjectPerformance[subject] = { total: 0, correct: 0, average: 0, tests: 0 }
      }
      subjectPerformance[subject].total += attempt.total_questions
      subjectPerformance[subject].correct += attempt.correct_answers
      subjectPerformance[subject].tests += 1
    })

    Object.keys(subjectPerformance).forEach((subject) => {
      const perf = subjectPerformance[subject]
      perf.average = Math.round((perf.correct / perf.total) * 100)
    })

    // Exam board performance
    const examBoardPerformance: Record<string, { average: number; tests: number; trend: number[] }> = {}
    attempts.forEach((attempt) => {
      const board = attempt.mock_tests?.[0]?.exam_board || "Unknown"
      if (!examBoardPerformance[board]) {
        examBoardPerformance[board] = { average: 0, tests: 0, trend: [] }
      }
      examBoardPerformance[board].trend.push(attempt.score)
      examBoardPerformance[board].tests += 1
    })

    Object.keys(examBoardPerformance).forEach((board) => {
      const perf = examBoardPerformance[board]
      perf.average = Math.round(perf.trend.reduce((sum, score) => sum + score, 0) / perf.trend.length)
    })

    // Time management analysis
    const totalTimeSpent = attempts.reduce((sum, attempt) => sum + (attempt.time_spent || 0), 0)
    const averageTime = Math.round(totalTimeSpent / totalTests / 60000) // minutes
    const averageQuestions = attempts.reduce((sum, attempt) => sum + attempt.total_questions, 0) / totalTests
    const efficiency = Math.round((averageQuestions / Math.max(averageTime, 1)) * 60) // questions per hour

    // Identify improvement areas
    const improvementAreas = Object.entries(subjectPerformance)
      .filter(([, perf]) => perf.average < 70)
      .sort(([, a], [, b]) => a.average - b.average)
      .slice(0, 3)
      .map(([subject, perf]) => ({
        subject,
        currentScore: perf.average,
        testsTaken: perf.tests,
        recommendation: perf.tests < 3 ? "Take more tests in this subject" : "Focus on weak topics within this subject",
      }))

    return NextResponse.json({
      timeframe,
      totalTests,
      averageScore,
      scoreTrend,
      subjectPerformance,
      examBoardPerformance,
      timeManagement: {
        averageTime,
        efficiency,
        totalTimeSpent: Math.round(totalTimeSpent / 60000), // total minutes
      },
      improvementAreas,
    })
  } catch (error) {
    console.error("Error in performance analytics API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}