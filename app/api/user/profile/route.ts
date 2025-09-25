import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server-client"

export async function GET() {
  try {
  const supabase = createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    let { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    if (error && error.code === 'PGRST116') { // Profile not found
      // Create profile if it doesn't exist
      const userMetadata = user.user_metadata || {}
      const subscriptionPlanFromMeta = userMetadata.subscription_plan === 'elite' ? 'Student Elite' :
                                       userMetadata.subscription_plan === 'premium' ? 'Student Premium' : 'free'

      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          subscription_plan: subscriptionPlanFromMeta,
          full_name: userMetadata.full_name || null
        })
        .select('*')
        .single()

      if (createError) {
        console.error('Failed to create profile:', createError)
        return NextResponse.json({ error: "Failed to create profile" }, { status: 500 })
      }

      profile = newProfile
    } else if (error) {
      throw error
    }

    return NextResponse.json({ profile, email: user.email })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
  const supabase = createServerClient()
    const updates = await request.json()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
