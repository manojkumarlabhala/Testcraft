"use client"
import { InstitutionAdminDashboard } from "@/components/admin/institution-admin-dashboard"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { redirect } from "next/navigation"

export default function InstitutionAdminDashboardPage() {
  const [institutionId, setInstitutionId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient()
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error || !user) {
        redirect("/auth/login")
        return
      }

      // Check if user has institution role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, institution_id')
        .eq('id', user.id)
        .single()

      if (profileError || !profile || profile.role !== 'institution') {
        redirect("/auth/login")
        return
      }

      setInstitutionId(profile.institution_id || "demo-institution-id")
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return <InstitutionAdminDashboard institutionId={institutionId!} />
}
