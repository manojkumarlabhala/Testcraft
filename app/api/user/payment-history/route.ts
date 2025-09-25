import { NextResponse } from "next/server"
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

    const { data: history, error } = await supabase
      .from("payment_history")
      .select("*")
      .eq("user_id", user.id)
      .order("transaction_date", { ascending: false })

    if (error) throw error

    return NextResponse.json({ history })
  } catch (error) {
    console.error("Payment history error:", error)
    return NextResponse.json({ error: "Failed to fetch payment history" }, { status: 500 })
  }
}
