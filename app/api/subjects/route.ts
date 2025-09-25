import { type NextRequest, NextResponse } from "next/server"
import { getSubjectsByBoard } from "@/lib/database/queries"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const examBoardId = searchParams.get("examBoardId")

    if (!examBoardId) {
      return NextResponse.json({ error: "examBoardId is required" }, { status: 400 })
    }

    const subjects = await getSubjectsByBoard(examBoardId)
    return NextResponse.json({ subjects })
  } catch (error) {
    console.error("Error fetching subjects:", error)
    return NextResponse.json({ error: "Failed to fetch subjects" }, { status: 500 })
  }
}
