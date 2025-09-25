import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createServerClient } from "@/lib/supabase/server-client"
import { groq } from "@ai-sdk/groq"
import { generateObject } from "ai"
import { z } from "zod"

const QuestionSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string(),
      options: z.array(z.string()),
      correct_answer: z.number(),
      explanation: z.string(),
      difficulty: z.enum(["easy", "medium", "hard"]),
      topic: z.string(),
    }),
  ),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const serviceSupabase = createServerClient()
    
    // Local dev bypass flags
    const LOCAL_DEV_BYPASS = process.env.LOCAL_DEV_BYPASS === "true"
    const LOCAL_FAKE_AI = process.env.LOCAL_FAKE_AI === "true"

    // Check authentication (unless local bypass enabled)
    let user: any = null
    let skipInsert = false
    if (LOCAL_DEV_BYPASS) {
      // Create a pseudo-user for local testing and skip DB inserts that require real user FK
      user = { id: `local-dev-${Date.now()}` }
      skipInsert = true
    } else {
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser()
      if (authError || !authUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      user = authUser
    }

    const {
      category,
      subject,
      examBoard,
      class: className,
      topic,
      difficulty,
      questionCount: rawQuestionCount,
      timerPerQuestion: rawTimerPerQuestion,
      customTimer: rawCustomTimer,
      questionType,
      language,
    } = await request.json()

    const questionCount = Number.parseInt(rawQuestionCount as any) || 10
    const timerPerQuestion = Number.parseFloat(rawTimerPerQuestion as any) || 2
    const customTimer = Number.parseInt(rawCustomTimer as any) || 0

    // Calculate duration (in minutes) based on timer settings
    let duration = questionCount * 2 // default 2 minutes per question
    if (timerPerQuestion === 0) {
      duration = 0 // no timer
    } else if (timerPerQuestion === -1) {
      duration = customTimer // custom total time (minutes)
    } else {
      duration = Math.round(questionCount * timerPerQuestion) // minutes total
    }

    // Attempt to generate questions via AI; fall back to a simple local generator if requested or on failure
    let object: any = null
    try {
      if (LOCAL_FAKE_AI) throw new Error("Using local fake AI generator")
      const result = await generateObject({
        model: groq("llama-3.1-8b-instant"),
        schema: QuestionSchema,
        prompt: `Generate ${questionCount} ${questionType || "multiple choice"} questions for ${subject} subject, ${examBoard} board, Class ${className}.

      Category: ${category}
      Topic: ${topic || "General"}
      Difficulty: ${difficulty}
      Language: ${language || "English"}

      Requirements:
      - Each question should have 4 options (for MCQ or option-based types)
      - Provide detailed explanations for correct answers
      - Questions should be relevant to Indian curriculum and the specified category
      - Mix of conceptual and application-based questions
      - Ensure questions are appropriate for the specified class level and exam type

      If the question type is not option-based (e.g., Short Answer), adapt the format but keep the JSON schema.

      Format the response as a JSON object with an array of questions.`,
      })
      object = result.object
    } catch (aiErr) {
      // Fallback local generator
      // eslint-disable-next-line no-console
      console.warn("AI generation failed or disabled; using local fallback:", aiErr)
      object = { questions: generateFakeQuestions(questionCount, questionType, difficulty, topic) }
    }

    // Store generated questions in database only when a real authenticated user is present
    if (!skipInsert) {
      const { data: mockTest, error: insertError } = await serviceSupabase
        .from("mock_tests")
        .insert({
          name: `AI Generated ${subject} Test`,
          subject,
          difficulty,
          duration,
          total_questions: questionCount,
          questions: object.questions,
          creator_id: user.id,
        })
        .select()
        .single()

      if (insertError) {
        console.error("Error creating mock test:", insertError)
        return NextResponse.json({ error: "Failed to create mock test" }, { status: 500 })
      }

      return NextResponse.json({ mockTest, questions: object.questions })
    }

    // For local/dev bypass, return a synthetic mockTest object without inserting to DB
    const mockTest = {
      id: `local-${Date.now()}`,
      name: `AI Generated ${subject} Test`,
      subject,
      difficulty,
      duration,
      total_questions: questionCount,
      questions: object.questions,
      creator_id: user.id,
    }

    return NextResponse.json({ mockTest, questions: object.questions })
  } catch (error) {
    console.error("Error generating questions:", error)
    return NextResponse.json({ error: "Failed to generate questions" }, { status: 500 })
  }
}

// Simple local fallback question generator matching the required schema
function generateFakeQuestions(count: number, questionType?: string, difficulty?: string, topic?: string) {
  const questions: any[] = []
  for (let i = 0; i < count; i++) {
    const q = {
      question: `${topic || 'General'} - Sample question ${i + 1}`,
      options: [
        `Option A for ${i + 1}`,
        `Option B for ${i + 1}`,
        `Option C for ${i + 1}`,
        `Option D for ${i + 1}`,
      ],
      correct_answer: 0,
      explanation: `This is a placeholder explanation for sample question ${i + 1}`,
      difficulty: (['easy','medium','hard'].includes(difficulty || '') ? difficulty : 'medium'),
      topic: topic || 'General',
    }
    questions.push(q)
  }
  return questions
}
