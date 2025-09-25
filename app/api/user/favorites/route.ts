import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server-client"

export async function GET() {
  try {
  const supabase = createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    let favorites: any[] = []
    try {
      const { data, error } = await supabase
        .from("user_favorites")
        .select(`
          exam_paper_id,
          created_at,
          exam_papers(
            id,
            title,
            class_level,
            year,
            paper_type,
            is_premium,
            subjects(name),
            exam_boards(name)
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Favorites query error (exam_papers might be missing):", error)
        favorites = []
      } else {
        favorites = data || []
      }
    } catch (err) {
      console.error("Favorites fetch failed (possibly missing exam_papers table):", err)
      favorites = []
    }

    return NextResponse.json({ favorites })
  } catch (error) {
    console.error("Favorites fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 })
  }
}
