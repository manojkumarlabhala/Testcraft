import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server-client"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters
    const category = searchParams.get("category")
    const subject = searchParams.get("subject")
    const examBoard = searchParams.get("examBoard")
    const className = searchParams.get("class")
    const search = searchParams.get("search")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    // Build query
    let query = supabase
      .from("files")
      .select(`
        *,
        uploader:uploaded_by(full_name),
        download_count:file_downloads(count)
      `)
      .order("created_at", { ascending: false })

    // Apply filters
    if (category) query = query.eq("category", category)
    if (subject) query = query.eq("subject", subject)
    if (examBoard) query = query.eq("exam_board", examBoard)
    if (className) query = query.eq("class", className)
    if (search) {
      query = query.or(`filename.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: files, error, count } = await query

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 })
    }

    return NextResponse.json({
      files: files || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching files:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
