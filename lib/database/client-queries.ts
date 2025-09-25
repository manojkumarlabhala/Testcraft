import { createClient } from "@/lib/supabase/client"

export async function recordAnalytics(eventType: string, eventData: Record<string, any>) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  const { error } = await supabase.from("analytics").insert({
    user_id: user.id,
    event_type: eventType,
    event_data: eventData,
  })

  if (error) console.error("Analytics error:", error)
}

export async function toggleFavorite(paperId: string) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("User not authenticated")

  // Check if already favorited
  const { data: existing } = await supabase
    .from("user_favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("exam_paper_id", paperId)
    .single()

  if (existing) {
    // Remove from favorites
    const { error } = await supabase.from("user_favorites").delete().eq("user_id", user.id).eq("exam_paper_id", paperId)

    if (error) throw error
    return false
  } else {
    // Add to favorites
    const { error } = await supabase.from("user_favorites").insert({
      user_id: user.id,
      exam_paper_id: paperId,
    })

    if (error) throw error
    return true
  }
}

export async function downloadPaper(paperId: string) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("User not authenticated")

  // Record download
  const { error: downloadError } = await supabase.from("user_downloads").insert({
    user_id: user.id,
    exam_paper_id: paperId,
  })

  if (downloadError) throw downloadError

  // Increment download count
  const { error: countError } = await supabase.rpc("increment_download_count", {
    paper_id: paperId,
  })

  if (countError) throw countError

  // Record analytics
  await recordAnalytics("paper_download", { paper_id: paperId })
}
