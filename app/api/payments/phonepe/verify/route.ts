import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server-client"

export async function POST(request: NextRequest) {
  try {
    const { transactionId } = await request.json()

    const supabase = createServerClient()

    // Check if payment order exists and is completed
    const { data: order, error } = await supabase
      .from("payment_orders")
      .select("*")
      .eq("id", transactionId)
      .eq("status", "completed")
      .single()

    if (error || !order) {
      return NextResponse.json({ error: "Payment not found or not completed" }, { status: 404 })
    }

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error("PhonePe verification error:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
