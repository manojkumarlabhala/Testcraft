import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server-client"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json()
  const supabase = createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex")

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from("payment_orders")
      .select("*")
      .eq("razorpay_order_id", razorpay_order_id)
      .eq("user_id", user.id)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Update order status
    const { error: updateError } = await supabase
      .from("payment_orders")
      .update({
        status: "completed",
        razorpay_payment_id,
        razorpay_signature,
        completed_at: new Date().toISOString(),
      })
      .eq("id", order.id)

    if (updateError) throw updateError

    // Calculate subscription dates based on plan type
    const now = new Date()
    let subscriptionEnd: Date

    if (order.plan_type === "institution") {
      // Institution plan is monthly (30 days)
      subscriptionEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    } else {
      // All other plans are yearly (365 days)
      subscriptionEnd = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)
    }

    // Update user subscription
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        subscription_plan: order.plan_type,
        subscription_expires_at: subscriptionEnd.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (profileError) throw profileError

    // Record payment history
    const { error: historyError } = await supabase.from("payment_history").insert({
      user_id: user.id,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      plan_type: order.plan_type === "institution" ? "monthly" : "yearly", // Institution is monthly, others yearly
      payment_method: "razorpay",
      status: "completed",
      transaction_date: new Date().toISOString(),
      subscription_start_date: now.toISOString(),
      subscription_end_date: subscriptionEnd.toISOString(),
    })

    if (historyError) {
      console.error("Payment history error:", historyError)
    }

    return NextResponse.json({
      success: true,
      subscription: {
        plan: order.plan_type,
        expiresAt: subscriptionEnd.toISOString(),
      },
    })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 })
  }
}
