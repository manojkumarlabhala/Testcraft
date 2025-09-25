import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export function CommentsSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    fetchComments()
    setIsClient(true)
    // eslint-disable-next-line
  }, [postId])

  async function fetchComments() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/community/comments?post_id=${postId}`)
      const data = await res.json()
      setComments(data.comments || [])
    } catch {
      setError("Failed to load comments")
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateComment(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    // TODO: Replace with real user_id from auth
    const user_id = "demo-user-id"
    try {
      const res = await fetch("/api/community/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, post_id: postId, content: newComment })
      })
      const data = await res.json()
      if (res.ok) {
        setComments([...comments, data.comment])
        setNewComment("")
      } else {
        setError(data.error || "Failed to add comment")
      }
    } catch {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-4 border-t pt-4">
      <form onSubmit={handleCreateComment} className="mb-4 flex gap-2">
        <input
          className="flex-1 border rounded px-2 py-1"
          placeholder="Add a comment..."
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading || !newComment}>Comment</Button>
      </form>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="space-y-2">
        {comments.map((comment: any) => (
          <div key={comment.id} className="border rounded p-2">
            <div className="font-medium">{comment.user?.name || "Anonymous"} <span className="text-xs text-muted-foreground">({comment.user?.role || "Student"})</span></div>
            <div>{comment.content}</div>
            <div className="text-xs text-muted-foreground">{isClient ? new Date(comment.created_at).toLocaleString() : new Date(comment.created_at).toISOString()}</div>
          </div>
        ))}
        {comments.length === 0 && !loading && <div className="text-muted-foreground text-center">No comments yet.</div>}
      </div>
    </div>
  )
}
