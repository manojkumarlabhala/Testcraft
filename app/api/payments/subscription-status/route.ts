import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createServerClient } from "@/lib/supabase/server-client"

export async function GET() {
  console.log("=== SUBSCRIPTION STATUS API CALLED ===")
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    console.log("Subscription status API - Auth result:", { user: user?.id, error: authError })

    if (authError || !user) {
      console.log("Subscription status API - No user found")
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    console.log("Subscription status API - User authenticated:", user.id, user.email)

    // Special handling for test users
    // Keep the hardcoded elite test user for compatibility
    if (user.email === 'student.elite@testcraft.in') {
      console.log("Subscription status API - Test user detected, granting Student Elite access")
      const responseData = {
        plan: "Student Elite",
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
        isActive: true,
        daysRemaining: 365,
      }
      return NextResponse.json(responseData)
    }

    // If a test premium email is configured via env, grant Student Premium to that email.
    // This is an explicit opt-in: only active when the env var `TEST_STUDENT_PREMIUM_EMAIL` is set.
    const testPremiumEmail = process.env.TEST_STUDENT_PREMIUM_EMAIL
    if (testPremiumEmail && user.email === testPremiumEmail) {
      console.log("Subscription status API - Test premium user detected (env), granting Student Premium access", testPremiumEmail)
      const responseData = {
        plan: "Student Premium",
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
        isActive: true,
        daysRemaining: 365,
      }
      return NextResponse.json(responseData)
    }

    // Use service role client to read/create profile (bypass RLS reliably)
    const serviceClient = createServerClient()
    const userMetadata = user.user_metadata || {}
    const subscriptionPlanFromMeta = userMetadata.subscription_plan === 'elite' ? 'Student Elite' : (userMetadata.subscription_plan || 'free')

    // Set expiry date for Student Elite plans (1 year from now)
    const subscriptionExpiresAt = subscriptionPlanFromMeta === 'Student Elite'
      ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year from now
      : null

    let { data: profile, error: svcReadError } = await serviceClient
      .from('profiles')
      .select('subscription_plan, subscription_expires_at')
      .eq('id', user.id)
      .maybeSingle()

    if (svcReadError) console.error('Service role read error:', svcReadError)

  if (!profile) {
      console.log('Profile not found, attempting to create it via service role...')
      const { data: newProfile, error: createError } = await serviceClient
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          subscription_plan: subscriptionPlanFromMeta,
          subscription_expires_at: subscriptionExpiresAt,
          full_name: userMetadata.full_name || null
        })
        .select('subscription_plan, subscription_expires_at')
        .maybeSingle()

      if (createError) {
        console.error('Failed to create profile:', createError)
        // If insert fails due to column not existing, try without subscription_expires_at
        if (createError.message && createError.message.includes('subscription_expires_at')) {
          console.log('subscription_expires_at column not found, creating profile without it...')
          const { data: fallbackProfile, error: fallbackError } = await serviceClient
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email,
              subscription_plan: subscriptionPlanFromMeta,
              full_name: userMetadata.full_name || null
            })
            .select('subscription_plan')
            .maybeSingle()

          if (fallbackError) {
            console.error('Fallback profile creation also failed:', fallbackError)
          } else {
            console.log('Successfully created profile without expiry date:', fallbackProfile)
            profile = { ...fallbackProfile, subscription_expires_at: subscriptionExpiresAt } as any
          }
        }

        // Attempt a retry read via service role
        if (!profile) {
          const { data: retryProfile, error: retryError } = await serviceClient
            .from('profiles')
            .select('subscription_plan')
            .eq('id', user.id)
            .maybeSingle()

          if (retryError) {
            console.error('Retry read after create error failed:', retryError)
          } else if (retryProfile) {
            profile = { ...retryProfile, subscription_expires_at: subscriptionExpiresAt } as any
          }
        }
        // If still no profile, fall back to user metadata so frontend can show correct plan
        if (!profile) {
          const fallbackPlan = subscriptionPlanFromMeta
          console.log('Falling back to user metadata for subscription plan:', fallbackPlan)
          profile = { subscription_plan: fallbackPlan, subscription_expires_at: subscriptionExpiresAt } as any
        }
      } else {
        console.log('Successfully created profile via service role:', newProfile)
        profile = newProfile
      }
    }

    console.log("Subscription status API - Using profile:", profile)

    const now = new Date()
    let isActive = false
    let daysRemaining = 0
    let expiresAt = null

    if (profile?.subscription_plan === 'Student Elite') {
      // For Student Elite, always set 1-year validity
      const expiryDate = profile.subscription_expires_at
        ? new Date(profile.subscription_expires_at)
        : new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000) // 1 year from now if not set

      isActive = expiryDate > now
      expiresAt = expiryDate.toISOString()
      daysRemaining = Math.max(0, Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))

      // If the expiry date wasn't in the database, we should try to update it
      if (!profile.subscription_expires_at) {
        console.log('Updating profile with expiry date...')
        try {
          await serviceClient
            .from('profiles')
            .update({ subscription_expires_at: expiresAt })
            .eq('id', user.id)
        } catch (updateError) {
          console.log('Could not update expiry date in database (column may not exist), but proceeding with calculated date')
        }
      }
    }

    const responseData = {
      plan: profile?.subscription_plan || "free",
      expiresAt,
      isActive,
      daysRemaining,
    }

    console.log("Subscription status API - Final response:", responseData)

    return NextResponse.json(responseData)
  } catch (error) {
    console.error("Subscription status error:", error)
    return NextResponse.json({ error: "Failed to fetch subscription status" }, { status: 500 })
  }
}
