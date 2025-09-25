import { NextApiRequest, NextApiResponse } from 'next'
import { createServerClient } from '@/lib/supabase/server-client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerClient()

  try {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError || !authData?.user) return res.status(401).json({ error: 'Not authenticated' })

    const userId = authData.user.id
    const { data: profile, error: profileError } = await supabase.from('profiles').select('role').eq('id', userId).single()
    if (profileError || !profile) return res.status(403).json({ error: 'Profile not found' })

    const allowedRoles = ['teacher', 'admin', 'institution', 'superadmin']
    if (!allowedRoles.includes(profile.role)) return res.status(403).json({ error: 'Insufficient permissions' })

    if (req.method === 'POST') {
      const { action, flagId, postId } = req.body || {}
      if (!action) return res.status(400).json({ error: 'Missing action' })

      if (action === 'resolve_flag') {
        if (!flagId) return res.status(400).json({ error: 'Missing flagId' })
        const { error } = await supabase.from('community_flags').delete().eq('id', flagId)
        if (error) return res.status(500).json({ error: error.message })
        return res.status(200).json({ success: true })
      }

      if (action === 'remove_post') {
        if (!postId) return res.status(400).json({ error: 'Missing postId' })
        const { error } = await supabase.from('community_posts').delete().eq('id', postId)
        if (error) return res.status(500).json({ error: error.message })
        return res.status(200).json({ success: true })
      }

      return res.status(400).json({ error: 'Unknown action' })
    }

    res.status(405).end()
  } catch (e: any) {
    console.error('Admin action error:', e)
    res.status(500).json({ error: 'Server error' })
  }
}
