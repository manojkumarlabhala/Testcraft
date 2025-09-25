import { NextApiRequest, NextApiResponse } from "next"
import { createServerClient } from "@/lib/supabase/server-client"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerClient()

  if (req.method === "DELETE") {
    const { id } = req.body
    if (!id) return res.status(400).json({ error: "Missing fields" })

    // Authenticate user from cookie session
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser()
      if (authError || !authData?.user) return res.status(401).json({ error: "Not authenticated" })

      const userId = authData.user.id

      // Fetch profile role
      const { data: profile, error: profileError } = await supabase.from("profiles").select("role").eq("id", userId).single()
      if (profileError || !profile) return res.status(403).json({ error: "Profile not found" })

      const allowedRoles = ["teacher", "admin", "institution", "superadmin"]
      if (!allowedRoles.includes(profile.role)) {
        return res.status(403).json({ error: "Insufficient permissions to moderate" })
      }

      // Delete post and cascade related comments/flags (if FK constraints exist, db will handle it)
      const { error } = await supabase.from("community_posts").delete().eq("id", id)
      if (error) return res.status(500).json({ error: error.message })

      return res.status(200).json({ success: true })
    } catch (e: any) {
      console.error('Moderation error:', e)
      return res.status(500).json({ error: 'Server error' })
    }
  }

  res.status(405).end()
}
