import { type NextRequest, NextResponse } from "next/server"
import { generateQuestions } from "@/lib/groq"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { subject, topic, difficulty, count, questionType } = body

    // Generate questions using Groq
    const questions = await generateQuestions({ subject, topic, difficulty, count, questionType })

    return NextResponse.json({ questions })
  } catch (error) {
    console.error("Error generating mock test questions:", error)
    return NextResponse.json({ error: "Failed to generate questions" }, { status: 500 })
  }
}
