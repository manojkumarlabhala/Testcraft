import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server-client"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createServerClient()

  // Local dev bypass
  const LOCAL_DEV_BYPASS = process.env.LOCAL_DEV_BYPASS === "true"
  if (LOCAL_DEV_BYPASS && id?.startsWith("local-")) {
    // Return a synthetic mock test matching the schema used by the UI
    const questions = Array.from({ length: 5 }).map((_, i) => ({
      question: `Sample question ${i + 1}`,
      options: [`A${i}`, `B${i}`, `C${i}`, `D${i}`],
      correct_answer: 0,
      explanation: `Placeholder explanation ${i + 1}`,
      difficulty: "medium",
      topic: "General",
    }))

    return NextResponse.json({
      id,
      title: `Local Test ${id}`,
      duration: 2,
      questions,
    })
  }

  try {
    const { data, error } = await supabase.from("mock_tests").select("*").eq("id", id).single()
    if (error || !data) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 })
    }
    return NextResponse.json(data)
  } catch (err) {
    console.error("Error fetching mock test:", err)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
