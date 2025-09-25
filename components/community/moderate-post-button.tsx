"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function ModeratePostButton({ postId, userId, onModerate }: { postId: string, userId: string, onModerate: () => void }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleDelete() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/community/moderate", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: postId, user_id: userId })
      })
      const data = await res.json()
      if (res.ok) {
        onModerate()
      } else {
        setError(data.error || "Failed to delete post")
      }
    } catch {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-2">
      <Button variant="destructive" size="sm" onClick={handleDelete} disabled={loading}>
        Delete Post
      </Button>
      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
    </div>
  )
}
