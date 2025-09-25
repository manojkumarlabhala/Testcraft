import { type NextRequest, NextResponse } from "next/server"
import { getExamPapers } from "@/lib/database/queries"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const filters = {
      examBoardId: searchParams.get("examBoardId") || undefined,
      subjectId: searchParams.get("subjectId") || undefined,
      classLevel: searchParams.get("classLevel") || undefined,
      year: searchParams.get("year") ? Number.parseInt(searchParams.get("year")!) : undefined,
      paperType: searchParams.get("paperType") || undefined,
      searchTerm: searchParams.get("search") || undefined,
    }

    const papers = await getExamPapers(filters)

    return NextResponse.json({ papers })
  } catch (error) {
    console.error("Error fetching papers:", error)
    return NextResponse.json({ error: "Failed to fetch papers" }, { status: 500 })
  }
}
