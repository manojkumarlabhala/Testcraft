import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server-client"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-verify')

    // Get PhonePe configuration
    const supabase = createServerClient()
    const { data: gateway } = await supabase
      .from("payment_gateways")
      .select("*")
      .eq("provider", "phonepe")
      .eq("is_active", true)
      .single()

    if (!gateway?.api_key) {
      return NextResponse.json({ error: "PhonePe not configured" }, { status: 500 })
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHash('sha256')
      .update(body + gateway.api_key)
      .digest('hex')

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const payload = JSON.parse(body)

    // Update payment status
    if (payload.code === "PAYMENT_SUCCESS") {
      const { error } = await supabase
        .from("payment_orders")
        .update({
          status: "completed",
          razorpay_payment_id: payload.data.merchantTransactionId
        })
        .eq("id", payload.data.merchantTransactionId)

      if (error) throw error

      // Update user subscription
      const { data: order } = await supabase
        .from("payment_orders")
        .select("user_id, plan_type")
        .eq("id", payload.data.merchantTransactionId)
        .single()

      if (order) {
        // Calculate subscription expiry based on plan type
        let days: number
        if (order.plan_type === "institution") {
          days = 30 // Institution plan is monthly
        } else {
          days = 365 // All other plans are yearly
        }
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + days)

        await supabase
          .from("profiles")
          .update({
            subscription_plan: order.plan_type,
            subscription_expires_at: expiresAt.toISOString()
          })
          .eq("id", order.user_id)
      }
    }

    return NextResponse.json({ status: "ok" })
  } catch (error) {
    console.error("PhonePe webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
