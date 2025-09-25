import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server-client"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
  const supabase = createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Get mock test details
    const { data: mockTest, error: testError } = await supabase.from("mock_tests").select("*").eq("id", id).single()

    if (testError || !mockTest) {
      return NextResponse.json({ error: "Mock test not found" }, { status: 404 })
    }

    // Check if user has access (premium check)
    if (mockTest.is_premium) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_plan, subscription_expires_at")
        .eq("id", user.id)
        .single()

      if (!profile || profile.subscription_plan === "free") {
        return NextResponse.json({ error: "Premium subscription required" }, { status: 403 })
      }

      if (profile.subscription_expires_at && new Date(profile.subscription_expires_at) < new Date()) {
        return NextResponse.json({ error: "Subscription expired" }, { status: 403 })
      }
    }

    // Create test attempt
    const { data: attempt, error: attemptError } = await supabase
      .from("user_test_attempts")
      .insert({
        user_id: user.id,
        mock_test_id: id,
        score: 0,
        total_marks: mockTest.total_marks,
        percentage: 0,
        time_taken_minutes: 0,
        answers: {},
        is_completed: false,
      })
      .select()
      .single()

    if (attemptError) throw attemptError

    // Get questions
    const { data: questions, error: questionsError } = await supabase
      .from("mock_test_questions")
      .select("*")
      .eq("mock_test_id", id)
      .order("question_order")

    if (questionsError) throw questionsError

    return NextResponse.json({
      attempt,
      mockTest,
      questions: questions?.map((q) => ({
        ...q,
        correct_answer: undefined, // Don't send correct answer to client
        explanation: undefined, // Don't send explanation to client
      })),
    })
  } catch (error) {
    console.error("Start test error:", error)
    return NextResponse.json({ error: "Failed to start test" }, { status: 500 })
  }
}
