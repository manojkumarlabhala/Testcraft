import { type NextRequest, NextResponse } from "next/server"
import { getMockTests } from "@/lib/database/queries"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const filters = {
      examBoardId: searchParams.get("examBoardId") || undefined,
      subjectId: searchParams.get("subjectId") || undefined,
      classLevel: searchParams.get("classLevel") || undefined,
      difficultyLevel: searchParams.get("difficultyLevel") || undefined,
    }

    const mockTests = await getMockTests(filters)

    return NextResponse.json({ mockTests })
  } catch (error) {
    console.error("Error fetching mock tests:", error)
    return NextResponse.json({ error: "Failed to fetch mock tests" }, { status: 500 })
  }
}
