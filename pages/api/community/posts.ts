import { NextApiRequest, NextApiResponse } from "next"
import { createClient } from "@/lib/supabase/client"
import { containsInappropriateContent } from "@/lib/community/content-filter"
import { sanitizeText } from "@/lib/community/sanitize-text"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createClient()
  if (req.method === "GET") {
    // Fetch posts
    const { data, error } = await supabase.from("community_posts").select("*, user:profiles(id, name, role)").order("created_at", { ascending: false })
    if (error) return res.status(500).json({ error: error.message })
    // Hide personal details (show only name, role)
    const safePosts = (data || []).map((post: any) => ({
      ...post,
      user: post.user ? { name: post.user.name, role: post.user.role, id: post.user.id } : undefined
    }))
    return res.status(200).json({ posts: safePosts })
  }
  if (req.method === "POST") {
    // Create post
    const { user_id, content } = req.body
    if (!user_id || !content) return res.status(400).json({ error: "Missing fields" })
    if (containsInappropriateContent(content)) {
      return res.status(403).json({ error: "Post blocked due to inappropriate content." })
    }
  const safeContent = sanitizeText(content)
  const { data, error } = await supabase.from("community_posts").insert([{ user_id, content: safeContent }]).select()
    if (error) return res.status(500).json({ error: error.message })
    // Hide personal details in response
    const post = data[0]
    post.user = post.user ? { name: post.user.name, role: post.user.role, id: post.user.id } : undefined
    return res.status(201).json({ post })
  }
  res.status(405).end()
}
