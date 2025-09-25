import { NextApiRequest, NextApiResponse } from "next"
import { createClient } from "@/lib/supabase/client"
import { containsInappropriateContent } from "@/lib/community/content-filter"
import { sanitizeText } from "@/lib/community/sanitize-text"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createClient()
  if (req.method === "GET") {
    // Fetch comments for a post
    const { post_id } = req.query
    if (!post_id) return res.status(400).json({ error: "Missing post_id" })
    const { data, error } = await supabase.from("community_comments").select("*, user:profiles(id, name, role)").eq("post_id", post_id).order("created_at", { ascending: true })
    if (error) return res.status(500).json({ error: error.message })
    // Hide personal details (show only name, role)
    const safeComments = (data || []).map((comment: any) => ({
      ...comment,
      user: comment.user ? { name: comment.user.name, role: comment.user.role, id: comment.user.id } : undefined
    }))
    return res.status(200).json({ comments: safeComments })
  }
  if (req.method === "POST") {
    // Create comment
    const { user_id, post_id, content } = req.body
    if (!user_id || !post_id || !content) return res.status(400).json({ error: "Missing fields" })
    if (containsInappropriateContent(content)) {
      return res.status(403).json({ error: "Comment blocked due to inappropriate content." })
    }
  const safeContent = sanitizeText(content)
  const { data, error } = await supabase.from("community_comments").insert([{ user_id, post_id, content: safeContent }]).select()
    if (error) return res.status(500).json({ error: error.message })
    // Hide personal details in response
    const comment = data[0]
    comment.user = comment.user ? { name: comment.user.name, role: comment.user.role, id: comment.user.id } : undefined
    return res.status(201).json({ comment })
  }
  res.status(405).end()
}
