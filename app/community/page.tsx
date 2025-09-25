import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUserProfile } from "@/lib/database/queries"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import CommunityClient from "@/components/community/community-client"

export default async function CommunityPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  // allow guests to view community; if you want login required, uncomment redirect
  // if (error || !user) redirect('/auth/login')

  const profile = user ? await getUserProfile(user.id).catch(() => null) : null

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user as any} profile={profile} />
      <main className="container mx-auto px-4 py-8">
        {/* client-side interactive community feed */}
        <CommunityClient />
      </main>
    </div>
  )
}
