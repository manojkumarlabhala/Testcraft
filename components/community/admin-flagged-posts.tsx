"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export function AdminFlaggedPosts() {
  const [flaggedPosts, setFlaggedPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selected, setSelected] = useState<any | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const allowedRolesForModeration = ["teacher", "admin", "institution", "superadmin"]

  useEffect(() => {
    fetchFlaggedPosts()
    fetchUserRole()
  }, [])

  async function fetchFlaggedPosts() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/community/flagged-posts")
      const data = await res.json()
      setFlaggedPosts(data.posts || [])
    } catch {
      setError("Failed to load flagged posts")
    } finally {
      setLoading(false)
    }
  }

  async function fetchUserRole() {
    try {
      const res = await fetch('/api/user/profile')
      if (!res.ok) return
      const json = await res.json()
      setUserRole(json.profile?.role || null)
    } catch (e) {
      // ignore
    }
  }

  async function handleDelete(postId: string) {
    if (!confirm('Delete this post permanently?')) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/community/moderate", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: postId })
      })
      if (res.ok) {
        setFlaggedPosts(flaggedPosts.filter(p => p.id !== postId))
        if (selected?.id === postId) setSelected(null)
      } else {
        setError("Failed to delete post")
      }
    } catch (e) {
      console.warn('Delete error', e)
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  async function handleResolveFlag(flagId: string, postId: string) {
    setLoading(true)
    setError("")
    try {
      const res = await fetch('/api/community/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resolve_flag', flagId })
      })
      if (res.ok) {
        // remove flag from UI
        setFlaggedPosts(flaggedPosts.map(p => ({ ...p, flags: (p.flags || []).filter((f:any) => f.id !== flagId) })))
      } else {
        setError('Failed to resolve flag')
      }
    } catch (e) {
      console.warn('Resolve flag error', e)
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <h2 className="text-2xl font-bold mb-6 text-center">Flagged Posts (Admin)</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading && <div className="text-muted-foreground mb-4">Loading...</div>}
      <div className="space-y-6">
        {flaggedPosts.map((post: any) => (
          <div key={post.id} className="border rounded p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold">{post.user?.name || "Anonymous"} <span className="text-xs text-muted-foreground">({post.user?.role || "Student"})</span></div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setSelected(post)}>View</Button>
                {userRole && allowedRolesForModeration.includes(userRole) && (
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(post.id)}>Delete</Button>
                )}
              </div>
            </div>
            <div className="mb-2">{post.content}</div>
            <div className="text-xs text-muted-foreground">{typeof window !== "undefined" ? new Date(post.created_at).toLocaleString() : new Date(post.created_at).toISOString()}</div>
            <div className="mt-3">
              <div className="text-sm font-medium">Flags:</div>
              <div className="space-y-2 mt-2">
                {(post.flags || []).map((f: any) => (
                  <div key={f.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <div>
                      <div className="text-sm">{f.reason || 'No reason provided'}</div>
                      <div className="text-xs text-muted-foreground">Flagged by {f.user_id}</div>
                    </div>
                    <div>
                      {userRole && allowedRolesForModeration.includes(userRole) && (
                        <Button size="sm" onClick={() => handleResolveFlag(f.id, post.id)}>Resolve</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
        {flaggedPosts.length === 0 && !loading && <div className="text-muted-foreground text-center">No flagged posts.</div>}
      </div>
    </div>
  )
}
