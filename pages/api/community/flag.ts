import { NextApiRequest, NextApiResponse } from "next"
import { createClient } from "@/lib/supabase/client"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createClient()
  if (req.method === "POST") {
    const { post_id, user_id } = req.body
    if (!post_id || !user_id) return res.status(400).json({ error: "Missing fields" })
    // Insert flag record
    const { error } = await supabase.from("community_flags").insert([{ post_id, user_id }])
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true })
  }
  res.status(405).end()
}
