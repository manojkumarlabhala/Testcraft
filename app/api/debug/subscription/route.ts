import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    // Allow a quick local test override when not running in production.
    // If `testEmail` query param is supplied or `TEST_STUDENT_PREMIUM_EMAIL` env var is set
    // and the running env is not production, return an active premium response for that email.
    const url = new URL(request.url)
    const testEmailParam = url.searchParams.get('testEmail')
    const testEnvEmail = process.env.TEST_STUDENT_PREMIUM_EMAIL
    const allowTest = process.env.NEXT_PUBLIC_ENV !== 'production'

    if (allowTest && (testEmailParam || testEnvEmail)) {
      const testEmail = testEmailParam || testEnvEmail
      return NextResponse.json({
        user: { id: 'test-user', email: testEmail },
        profile: { subscription_plan: 'Student Premium' },
        subscription: { plan: 'Student Premium', expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), isActive: true, daysRemaining: 365 },
        debug: { testOverride: true }
      })
    }

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (profileError) {
      return NextResponse.json({ error: "Profile not found", details: profileError }, { status: 404 })
    }

    // Check subscription status
    const now = new Date()
    const isActive = profile?.subscription_plan === 'Student Elite'

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
      },
      profile: profile,
      subscription: {
        plan: profile?.subscription_plan || "free",
        expiresAt: null,
        isActive,
        daysRemaining: 0,
      },
      debug: {
        currentTime: now.toISOString(),
        planCheck: profile?.subscription_plan === 'Student Elite',
        expiryCheck: false,
      }
    })
  } catch (error) {
    console.error("Debug error:", error)
    return NextResponse.json({ error: "Failed to get debug info" }, { status: 500 })
  }
}
