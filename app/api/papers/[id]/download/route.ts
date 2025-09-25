import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server-client"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
  const supabase = createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Get paper details. Wrap in try/catch because the table may be missing in some environments.
    let paper: any = null
    try {
      const { data, error: paperError } = await supabase.from("exam_papers").select("*").eq("id", id).single()
      if (paperError || !data) {
        return NextResponse.json({ error: "Paper not found" }, { status: 404 })
      }
      paper = data
    } catch (err) {
      console.error("Possible missing exam_papers table or DB error while fetching paper:", err)
      return NextResponse.json({ error: "Paper resource unavailable" }, { status: 404 })
    }

    // Check user subscription status
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_plan, subscription_expires_at")
      .eq("id", user.id)
      .single()

    const isPremiumUser = profile &&
      (profile.subscription_plan === "Student Elite" || profile.subscription_plan === "Student Premium") &&
      (!profile.subscription_expires_at || new Date(profile.subscription_expires_at) > new Date())

    // For premium papers, check if user has active premium subscription
    if (paper.is_premium && !isPremiumUser) {
      return NextResponse.json({ error: "Premium subscription required" }, { status: 403 })
    }

    // For free users downloading any paper, require ad completion
    const requiresAd = !isPremiumUser

    if (requiresAd) {
      // Check if user has completed an ad recently (within last 30 minutes)
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)
      const { data: recentAd } = await supabase
        .from("ad_completions")
        .select("*")
        .eq("user_id", user.id)
        .gte("completed_at", thirtyMinutesAgo.toISOString())
        .order("completed_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      if (!recentAd) {
        return NextResponse.json({
          error: "Ad required",
          requiresAd: true,
          message: "Please watch an ad to download this paper"
        }, { status: 402 }) // 402 Payment Required - using for ad requirement
      }
    }

    // Record download
    const { error: downloadError } = await supabase.from("user_downloads").insert({
      user_id: user.id,
      exam_paper_id: id,
    })

    if (downloadError) {
      console.error("Download record error:", downloadError)
    }

    // Increment download count
    const { error: countError } = await supabase.rpc("increment_download_count", {
      paper_id: id,
    })

    if (countError) {
      console.error("Count increment error:", countError)
    }

    return NextResponse.json({
      success: true,
      downloadUrl: paper.file_url,
      fileName: `${paper.title}.pdf`,
    })
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json({ error: "Download failed" }, { status: 500 })
  }
}
