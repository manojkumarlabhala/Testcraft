"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export function useRequireLogin() {
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      // In dev, allow /test pages to skip redirect so E2E tests can mount client-only components
      if (process.env.NODE_ENV !== 'production' && window.location.pathname.startsWith('/test')) {
        return
      }

      const supabase = createClient()
      const { data } = await supabase.auth.getUser()
      if (!data?.user) {
        router.replace("/login")
      }
    }
    checkAuth()
  }, [router])
}
