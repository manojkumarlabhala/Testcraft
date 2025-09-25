import { NextApiRequest, NextApiResponse } from "next"
import { createServerClient } from "@/lib/supabase/server-client"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerClient()

  if (req.method === "GET") {
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser()
      if (authError || !authData?.user) return res.status(401).json({ error: "Not authenticated" })

      const userId = authData.user.id
      const { data: profile, error: profileError } = await supabase.from("profiles").select("role").eq("id", userId).single()
      if (profileError || !profile) return res.status(403).json({ error: "Profile not found" })

      const allowedRoles = ["teacher", "admin", "institution", "superadmin"]
      if (!allowedRoles.includes(profile.role)) {
        return res.status(403).json({ error: "Insufficient permissions to view flagged posts" })
      }

      // Fetch flagged posts and their flags
      const { data, error } = await supabase
        .from("community_posts")
        .select("id, content, created_at, user:profiles(id, name, role), flags:community_flags(id, user_id, reason, created_at)")
        .order("created_at", { ascending: false })

      if (error) return res.status(500).json({ error: error.message })

      // Filter posts that have flags client-side (in case flags are separate)
      const postsWithFlags = (data || []).filter((p: any) => Array.isArray(p.flags) && p.flags.length > 0)

      return res.status(200).json({ posts: postsWithFlags })
    } catch (e: any) {
      console.error('Flagged posts error:', e)
      return res.status(500).json({ error: 'Server error' })
    }
  }

  res.status(405).end()
}
