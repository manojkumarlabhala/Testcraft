import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server-client"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { attemptId, answers, timeTaken } = await request.json()
  const supabase = createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Get questions with correct answers
    const { data: questions, error: questionsError } = await supabase
      .from("mock_test_questions")
      .select("*")
      .eq("mock_test_id", id)

    if (questionsError) throw questionsError

    // Calculate score
    let score = 0
    const results: Record<string, any> = {}

    questions?.forEach((question) => {
      const userAnswer = answers[question.id]
      const isCorrect = userAnswer === question.correct_answer

      if (isCorrect) {
        score += question.marks
      }

      results[question.id] = {
        userAnswer,
        correctAnswer: question.correct_answer,
        isCorrect,
        marks: isCorrect ? question.marks : 0,
        explanation: question.explanation,
      }
    })

    const totalMarks = questions?.reduce((sum, q) => sum + q.marks, 0) || 0
    const percentage = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0

    // Update attempt
    const { error: updateError } = await supabase
      .from("user_test_attempts")
      .update({
        score,
        percentage,
        time_taken_minutes: timeTaken,
        answers: results,
        is_completed: true,
        completed_at: new Date().toISOString(),
      })
      .eq("id", attemptId)
      .eq("user_id", user.id)

    if (updateError) throw updateError

    // Increment attempt count
    // Increment attempt_count using a raw SQL query
    const { error: countError } = await supabase.rpc('increment_attempt_count', { test_id: id })
    if (countError) {
      console.error("Count increment error:", countError)
    }

    return NextResponse.json({
      score,
      totalMarks,
      percentage,
      results,
      timeTaken,
    })
  } catch (error) {
    console.error("Submit test error:", error)
    return NextResponse.json({ error: "Failed to submit test" }, { status: 500 })
  }
}
