"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function FlagPostButton({ postId, userId }: { postId: string, userId: string }) {
  const [flagged, setFlagged] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleFlag() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/community/flag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: postId, user_id: userId })
      })
      const data = await res.json()
      if (res.ok) {
        setFlagged(true)
      } else {
        setError(data.error || "Failed to flag post")
      }
    } catch {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-2">
      <Button variant="outline" size="sm" onClick={handleFlag} disabled={loading || flagged}>
        {flagged ? "Flagged" : "Flag as inappropriate"}
      </Button>
      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
    </div>
  )
}
