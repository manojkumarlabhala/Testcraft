import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server-client"
import Razorpay from "razorpay"
import { PhonePePayment } from "@/lib/payments/phonepe"

export async function POST(request: NextRequest) {
  try {
    const { planType, amount, gateway = "razorpay" } = await request.json()
    const supabase = createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Get active payment gateway configuration
    const { data: gatewayConfig, error: gatewayError } = await supabase
      .from("payment_gateways")
      .select("*")
      .eq("provider", gateway)
      .eq("is_active", true)
      .single()

    if (gatewayError || !gatewayConfig) {
      return NextResponse.json({ error: "Payment gateway not configured" }, { status: 500 })
    }

    let orderResult: any

    if (gateway === "razorpay") {
      const razorpay = new Razorpay({
        key_id: gatewayConfig.api_key || process.env.RAZORPAY_KEY_ID!,
        key_secret: gatewayConfig.api_secret || process.env.RAZORPAY_KEY_SECRET!,
      })

      const order = await razorpay.orders.create({
        amount: amount * 100, // Convert to paise
        currency: "INR",
        receipt: `order_${Date.now()}`,
        notes: {
          userId: user.id,
          planType,
        },
      })

      orderResult = {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: gatewayConfig.api_key,
        gateway: "razorpay"
      }
    } else if (gateway === "phonepe") {
      if (!gatewayConfig.merchant_id || !gatewayConfig.api_key) {
        return NextResponse.json({ error: "PhonePe not properly configured" }, { status: 500 })
      }

      const phonepe = new PhonePePayment(
        gatewayConfig.merchant_id,
        gatewayConfig.api_key,
        gatewayConfig.test_mode
      )

      const orderId = `order_${Date.now()}`
      orderResult = await phonepe.createOrder(amount, orderId, user.id, planType)
      orderResult.gateway = "phonepe"
    } else {
      return NextResponse.json({ error: "Unsupported payment gateway" }, { status: 400 })
    }

    // Store order in database
    const { error } = await supabase.from("payment_orders").insert({
      id: orderResult.orderId,
      user_id: user.id,
      amount,
      currency: "INR",
      plan_type: planType,
      status: "created",
      razorpay_order_id: orderResult.orderId,
    })

    if (error) throw error

    return NextResponse.json(orderResult)
  } catch (error) {
    console.error("Create order error:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
