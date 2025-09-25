import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server-client"

export async function POST(request: Request) {
  try {
    const supabase = createServerClient()
    const body = (await request.json()) || {}
    const { testId, answers = [], timeSpent = 0 } = body

    const LOCAL_DEV_BYPASS = process.env.LOCAL_DEV_BYPASS === "true"

    // Local dev bypass: handle without authentication for any test ID
    if (LOCAL_DEV_BYPASS) {
      // For local dev, try to fetch actual test data or use synthetic data
      let mockTest: any = null
      
      if (typeof testId === "string" && testId.startsWith("local-")) {
        // Use synthetic data for local test IDs
        mockTest = {
          id: testId,
          title: `Local Test ${testId}`,
          duration: 10,
          questions: Array.from({ length: 5 }).map((_, i) => ({
            question: `Sample question ${i + 1}`,
            options: [`A${i}`, `B${i}`, `C${i}`, `D${i}`],
            correct_answer: 0,
            explanation: `Placeholder explanation ${i + 1}`,
          })),
        }
      } else {
        // Try to fetch real test data
        try {
          const { data, error } = await supabase.from("mock_tests").select("*").eq("id", testId).single()
          if (data && !error) {
            mockTest = data
          } else {
            // Fallback to synthetic data if real test not found
            mockTest = {
              id: testId,
              title: `Test ${testId}`,
              duration: 10,
              questions: Array.from({ length: 5 }).map((_, i) => ({
                question: `Sample question ${i + 1}`,
                options: [`A${i}`, `B${i}`, `C${i}`, `D${i}`],
                correct_answer: 0,
                explanation: `Placeholder explanation ${i + 1}`,
              })),
            }
          }
        } catch (err) {
          // Fallback to synthetic data on any error
          mockTest = {
            id: testId,
            title: `Test ${testId}`,
            duration: 10,
            questions: Array.from({ length: 5 }).map((_, i) => ({
              question: `Sample question ${i + 1}`,
              options: [`A${i}`, `B${i}`, `C${i}`, `D${i}`],
              correct_answer: 0,
              explanation: `Placeholder explanation ${i + 1}`,
            })),
          }
        }
      }

      const totalQuestions = Array.isArray(mockTest.questions) ? mockTest.questions.length : 0
      const detailedResults: any[] = []
      let correctAnswers = 0
      
      for (let i = 0; i < totalQuestions; i++) {
        const q = mockTest.questions[i]
        const userAnswer = Array.isArray(answers) ? answers[i] : undefined
        const isCorrect = typeof userAnswer === "number" && userAnswer === q.correct_answer
        if (isCorrect) correctAnswers++
        detailedResults.push({
          questionIndex: i,
          correctAnswer: q.correct_answer,
          userAnswer: userAnswer ?? null,
          isCorrect,
          explanation: q.explanation ?? null,
        })
      }

      const score = totalQuestions ? Math.round((correctAnswers / totalQuestions) * 100) : 0
      const analysis = `You scored ${score}% on this test. Review the explanations for each question to improve.`

      return NextResponse.json({
        attemptId: `local-attempt-${Date.now()}`,
        score,
        correctAnswers,
        totalQuestions,
        detailedResults,
        analysis,
        timeSpent,
      })
    }

    // Load mock test from database
    const { data, error } = await supabase.from("mock_tests").select("*").eq("id", testId).single()
    if (error || !data) {
      console.error("Mock test not found:", error)
      return NextResponse.json({ error: "Test not found" }, { status: 404 })
    }
    const mockTest = data

    const totalQuestions = Array.isArray(mockTest.questions) ? mockTest.questions.length : 0

    // Grade answers
    const detailedResults: any[] = []
    let correctAnswers = 0
    for (let i = 0; i < totalQuestions; i++) {
      const q = mockTest.questions[i]
      const userAnswer = Array.isArray(answers) ? answers[i] : undefined
      const isCorrect = typeof userAnswer === "number" && userAnswer === q.correct_answer
      if (isCorrect) correctAnswers++
      detailedResults.push({
        questionIndex: i,
        correctAnswer: q.correct_answer,
        userAnswer: userAnswer ?? null,
        isCorrect,
        explanation: q.explanation ?? null,
      })
    }

    const score = totalQuestions ? Math.round((correctAnswers / totalQuestions) * 100) : 0
    const analysis = `You scored ${score}% on this test. Review the explanations for each question to improve.`

    // Persist attempt for authenticated users
    const { data: authData, error: authError } = await supabase.auth.getUser()
    const user = authData?.user
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: attempt, error: insertError } = await supabase
      .from("test_attempts")
      .insert({
        mock_test_id: testId,
        user_id: user.id,
        answers,
        time_spent: timeSpent,
        score,
        correct_answers: correctAnswers,
        total_questions: totalQuestions,
        detailed_results: detailedResults,
        ai_analysis: analysis,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (insertError) {
      console.error("Error saving attempt:", insertError)
      return NextResponse.json({ error: "Failed to save attempt" }, { status: 500 })
    }

    return NextResponse.json({
      attemptId: attempt?.id ?? null,
      score,
      correctAnswers,
      totalQuestions,
      detailedResults,
      analysis,
      timeSpent,
    })
  } catch (err) {
    console.error("Error analyzing performance:", err)
    return NextResponse.json({ error: "Failed to analyze performance" }, { status: 500 })
  }
}
