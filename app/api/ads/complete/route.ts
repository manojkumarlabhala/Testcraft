import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server-client"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Record ad completion
    const { error } = await supabase.from("ad_completions").insert({
      user_id: user.id,
      completed_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Ad completion record error:", error)
      return NextResponse.json({ error: "Failed to record ad completion" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Ad completion recorded" })
  } catch (error) {
    console.error("Ad completion error:", error)
    return NextResponse.json({ error: "Ad completion failed" }, { status: 500 })
  }
}
