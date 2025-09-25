import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server-client"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = createServerClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get file details
    const { data: file, error: fileError } = await supabase.from("files").select("*").eq("id", id).single()

    if (fileError || !file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Record download
    await supabase.from("file_downloads").insert({
      file_id: id,
      user_id: user.id,
    })

    // Record analytics event
    await supabase.from("analytics").insert({
      user_id: user.id,
      event_type: "file_download",
      event_data: {
        fileId: id,
        filename: file.filename,
        category: file.category,
        subject: file.subject,
      },
    })

    return NextResponse.json({
      success: true,
      downloadUrl: file.file_url,
    })
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json({ error: "Download failed" }, { status: 500 })
  }
}
