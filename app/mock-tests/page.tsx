"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function MockTestsPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to create page
    router.replace("/mock-tests/create")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Redirecting...</h1>
        <p className="text-muted-foreground">Taking you to create a mock test</p>
      </div>
    </div>
  )
}