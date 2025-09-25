import { NextResponse } from "next/server"
import { getExamBoards } from "@/lib/database/queries"

export async function GET() {
  try {
    const examBoards = await getExamBoards()
    return NextResponse.json({ examBoards })
  } catch (error) {
    console.error("Error fetching exam boards:", error)
    return NextResponse.json({ error: "Failed to fetch exam boards" }, { status: 500 })
  }
}
