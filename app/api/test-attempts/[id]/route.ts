import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server-client"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = createServerClient()

    const LOCAL_DEV_BYPASS = process.env.LOCAL_DEV_BYPASS === "true"

    // Local dev bypass: handle without authentication for any attempt in dev mode
    if (LOCAL_DEV_BYPASS) {
      // Return synthetic test results for local development
      return NextResponse.json({
        score: 80,
        correctAnswers: 4,
        totalQuestions: 5,
        detailedResults: [
          {
            questionIndex: 0,
            correctAnswer: 0,
            userAnswer: 0,
            isCorrect: true,
            explanation: "This is a sample explanation for question 1."
          },
          {
            questionIndex: 1,
            correctAnswer: 1,
            userAnswer: 1,
            isCorrect: true,
            explanation: "This is a sample explanation for question 2."
          },
          {
            questionIndex: 2,
            correctAnswer: 2,
            userAnswer: 1,
            isCorrect: false,
            explanation: "This is a sample explanation for question 3. The correct answer was C."
          },
          {
            questionIndex: 3,
            correctAnswer: 0,
            userAnswer: 0,
            isCorrect: true,
            explanation: "This is a sample explanation for question 4."
          },
          {
            questionIndex: 4,
            correctAnswer: 1,
            userAnswer: 1,
            isCorrect: true,
            explanation: "This is a sample explanation for question 5."
          }
        ],
        analysis: "You scored 80% on this test. Review the explanations for each question to improve.",
        timeSpent: 120000,
      })
    }

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get test attempt details
    const { data: attempt, error } = await supabase
      .from("test_attempts")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (error || !attempt) {
      return NextResponse.json({ error: "Test attempt not found" }, { status: 404 })
    }

    return NextResponse.json({
      score: attempt.score,
      correctAnswers: attempt.correct_answers,
      totalQuestions: attempt.total_questions,
      detailedResults: attempt.detailed_results,
      analysis: attempt.ai_analysis,
      timeSpent: attempt.time_spent,
    })
  } catch (error) {
    console.error("Error fetching test attempt:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
