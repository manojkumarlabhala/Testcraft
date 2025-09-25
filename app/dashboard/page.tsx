import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUserProfile } from "@/lib/database/queries"
import { isSuperAdmin } from "@/lib/admin/super-admin-emails"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"
import AnalyticsWidget from "@/components/dashboard/analytics-widget"
import { AIChatAgent } from "@/components/ai-chat-agent"
import { UserProfileCard } from "@/components/dashboard/user-profile-card"

async function getSubscriptionStatusServerSide(supabase: Awaited<ReturnType<typeof createClient>>) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { plan: 'free', isActive: false }
    }

    // Special test user handling
    if (user.email === 'student.elite@testcraft.in') {
      return { plan: 'Student Elite', isActive: true }
    }

    // Test premium email override (same logic as API route)
    const testPremiumEmail = process.env.TEST_STUDENT_PREMIUM_EMAIL
    if (testPremiumEmail && user.email === testPremiumEmail) {
      return { plan: 'Student Premium', isActive: true }
    }

    // Read profile via service role or server client
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('subscription_plan, subscription_expires_at')
      .eq('id', user.id)
      .maybeSingle()

    if (profileErr) {
      console.error('Error reading profile for subscription status:', profileErr)
      return { plan: 'free', isActive: false }
    }

    const plan = profile?.subscription_plan || 'free'
    let isActive = false

    if (plan === 'Student Elite' || plan === 'Student Premium') {
      if (!profile?.subscription_expires_at) {
        // treat as active if no expiry set for legacy data
        isActive = true
      } else {
        isActive = new Date(profile.subscription_expires_at) > new Date()
      }
    }

    return { plan, isActive }
  } catch (err) {
    console.error('Subscription status server-side error:', err)
    return { plan: 'free', isActive: false }
  }
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Redirect super admins to their admin dashboard
  if (isSuperAdmin(user.email)) {
    redirect("/admin/super-admin-dashboard")
  }

  const profile = await getUserProfile(user.id).catch(() => null)
  const subscriptionStatus = await getSubscriptionStatusServerSide(supabase)

  // Check if user is Student Elite for other features
  const isStudentElite = (subscriptionStatus.plan === 'Student Elite' && subscriptionStatus.isActive) || user.email === 'student.elite@testcraft.in'

  console.log("Dashboard: User email:", user.email)
  console.log("Dashboard: Subscription status:", subscriptionStatus)
  console.log("Dashboard: isStudentElite:", isStudentElite)

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} profile={profile} />
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8">
          <DashboardStats userId={user.id} />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <RecentActivity userId={user.id} />
                <QuickActions />
              </div>
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Performance Analytics</h2>
                <AnalyticsWidget />
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">My Profile</h2>
              <UserProfileCard />
              {/* Debug info for development */}
              {process.env.NODE_ENV === 'development' && (
                <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 mt-4">
                  <h3 className="font-bold text-yellow-800">Debug Info</h3>
                  <p className="text-sm text-yellow-700">Email: {user.email}</p>
                  <p className="text-sm text-yellow-700">Plan: {subscriptionStatus.plan}</p>
                  <p className="text-sm text-yellow-700">Active: {subscriptionStatus.isActive ? 'Yes' : 'No'}</p>
                  <p className="text-sm text-yellow-700">isStudentElite: {isStudentElite ? 'Yes' : 'No'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      {/* Floating AI Chat Bubble - always visible for all users */}
      <AIChatAgent userEmail={user.email} isStudentElite={isStudentElite} />
    </div>
  )
}
