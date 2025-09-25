"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { CommentsSection } from "@/components/community/comments-section"
import { FlagPostButton } from "@/components/community/flag-post-button"

export default function CommunityClient() {
  const [posts, setPosts] = useState<any[]>([])
  const [newPost, setNewPost] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [filter, setFilter] = useState<'all'|'teachers'|'students'|'trending'>('all')
  const [likesMap, setLikesMap] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetchPosts()
    checkAuth()
    // load likes from localStorage
    try {
      const raw = localStorage.getItem('community-likes')
      if (raw) setLikesMap(JSON.parse(raw))
    } catch {}
  }, [])

  async function checkAuth() {
    try {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()
      const { data } = await supabase.auth.getUser()
      setIsLoggedIn(!!data?.user)
      setUser(data?.user)
    } catch {
      setIsLoggedIn(false)
    }
  }

  async function fetchPosts() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/community/posts")
      const data = await res.json()
      setPosts(data.posts || [])
    } catch (err) {
      console.warn('Failed to load posts', err)
      setError("Failed to load posts")
    } finally {
      setLoading(false)
    }
  }

  async function handleCreatePost(e: React.FormEvent) {
    e.preventDefault()
    if (!isLoggedIn) {
      setError("Please login to post in the community.")
      return
    }
    setLoading(true)
    setError("")
    const user_id = user.id
    try {
      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, content: newPost })
      })
      const data = await res.json()
      if (res.ok) {
        setPosts([data.post, ...posts])
        setNewPost("")
      } else {
        setError(data.error || "Failed to create post")
      }
    } catch (e) {
      console.warn('Network error creating post', e)
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  function toggleLike(postId: string) {
    const next = { ...likesMap, [postId]: !likesMap[postId] }
    setLikesMap(next)
    try { localStorage.setItem('community-likes', JSON.stringify(next)) } catch {}
  }

  const filtered = posts.filter(p => {
    if (filter === 'all') return true
    if (filter === 'teachers') return p.user?.role === 'teacher'
    if (filter === 'students') return p.user?.role !== 'teacher'
    return true
  }).sort((a,b) => {
    if (filter === 'trending') {
      // simple trending heuristic: prefer posts with comments or longer content
      const aScore = (a.comments_count || 0) + (a.content?.length || 0) / 200
      const bScore = (b.comments_count || 0) + (b.content?.length || 0) / 200
      return bScore - aScore
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Community</h1>

      <form onSubmit={handleCreatePost} className="mb-6">
        <label htmlFor="new-post" className="sr-only">Create a post</label>
        <textarea
          id="new-post"
          className="w-full border rounded p-3 resize-none min-h-[84px]"
          placeholder={isLoggedIn ? "Share something helpful for students or teachers..." : "Please login to post"}
          value={newPost}
          onChange={e => setNewPost(e.target.value)}
          required
          aria-label="Create a post"
        />
        <div className="flex items-center justify-between mt-2">
          <div className="text-sm text-muted-foreground">{newPost.length}/1000</div>
          <div className="flex items-center gap-2">
            <Button type="submit" disabled={loading || !newPost || !isLoggedIn}>Post</Button>
          </div>
        </div>
      </form>

      <div className="flex gap-2 mb-6 flex-wrap">
        <button onClick={() => setFilter('all')} aria-pressed={filter==='all'} className={`px-3 py-1 rounded ${filter==='all' ? 'bg-primary text-white' : 'bg-muted'}`}>All</button>
        <button onClick={() => setFilter('teachers')} aria-pressed={filter==='teachers'} className={`px-3 py-1 rounded ${filter==='teachers' ? 'bg-primary text-white' : 'bg-muted'}`}>Teachers</button>
        <button onClick={() => setFilter('students')} aria-pressed={filter==='students'} className={`px-3 py-1 rounded ${filter==='students' ? 'bg-primary text-white' : 'bg-muted'}`}>Students</button>
        <button onClick={() => setFilter('trending')} aria-pressed={filter==='trending'} className={`px-3 py-1 rounded ${filter==='trending' ? 'bg-primary text-white' : 'bg-muted'}`}>Trending</button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading && <div className="text-muted-foreground mb-4">Loading...</div>}

      <div className="space-y-6">
        {filtered.map((post: any) => (
          <article key={post.id} className="border rounded p-4 shadow-sm bg-white">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold">{post.user?.name ? post.user.name[0] : 'U'}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{post.user?.name || 'Anonymous'}</div>
                    <div className="text-xs text-muted-foreground">{post.user?.role || 'Student'}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{new Date(post.created_at).toLocaleString()}</div>
                </div>
                <div className="mt-3 mb-3 text-sm whitespace-pre-wrap">{post.content}</div>

                <div className="flex items-center gap-3">
                  <button aria-pressed={!!likesMap[post.id]} aria-label={likesMap[post.id] ? 'Unlike' : 'Like'} onClick={() => toggleLike(post.id)} className="text-sm text-muted-foreground hover:text-primary">
                    {likesMap[post.id] ? '♥ Liked' : '♡ Like'}
                  </button>
                  <CommentsSection postId={post.id} />
                  <FlagPostButton postId={post.id} userId={user?.id || 'anonymous'} />
                </div>
              </div>
            </div>
          </article>
        ))}

        {filtered.length === 0 && !loading && <div className="text-muted-foreground text-center">No posts yet. Be the first to post!</div>}
      </div>
    </div>
  )
}
