import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUserProfile } from "@/lib/database/queries"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AdminFlaggedPosts } from "@/components/community/admin-flagged-posts"

export default async function AdminFlaggedPostsPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/auth/login')
  }

  const profile = await getUserProfile(user.id).catch(() => null)

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} profile={profile} />
      <main className="container mx-auto px-4 py-8">
        <AdminFlaggedPosts />
      </main>
    </div>
  )
}
