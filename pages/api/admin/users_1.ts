import { NextApiRequest, NextApiResponse } from "next"
import { createServerClient } from "@/lib/supabase/server-client"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerClient()
  if (req.method === "GET") {
    // List all users for admin
    const { data, error } = await supabase.from("profiles").select("id, name, email, role")
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ users: data })
  }
  // TODO: Add user modification logic for POST/PATCH
  res.status(405).end()
}
