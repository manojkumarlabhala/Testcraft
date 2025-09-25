import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server-client"

export async function POST() {
  try {
    const supabase = createServerClient()

    // First, let's find the user by querying profiles with email
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", "student.elite@testcraft.in")
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 })
    }

    // Update the profile
    const { data, error } = await supabase
      .from("profiles")
      .update({
        subscription_plan: "Student Elite",
        updated_at: new Date().toISOString()
      })
      .eq("id", profile.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Updated subscription plan to Student Elite",
      userId: profile.id
    })

  } catch (error) {
    console.error("Update error:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}
