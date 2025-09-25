import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server-client"
import { isSuperAdmin } from "@/lib/admin/super-admin-emails"

export async function GET() {
  try {
    const supabase = createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user || !isSuperAdmin(user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { data: gateways, error } = await supabase
      .from("payment_gateways")
      .select("*")
      .order("created_at")

    if (error) throw error

    return NextResponse.json({ gateways })
  } catch (error) {
    console.error("Get payment gateways error:", error)
    return NextResponse.json({ error: "Failed to fetch payment gateways" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user || !isSuperAdmin(user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id, name, provider, is_active, api_key, api_secret, merchant_id, webhook_secret, test_mode, config } = await request.json()

    const updateData: any = {
      name,
      provider,
      is_active,
      test_mode,
      config: config || {},
      updated_at: new Date().toISOString()
    }

    // Only include sensitive fields if they are provided
    if (api_key !== undefined) updateData.api_key = api_key
    if (api_secret !== undefined) updateData.api_secret = api_secret
    if (merchant_id !== undefined) updateData.merchant_id = merchant_id
    if (webhook_secret !== undefined) updateData.webhook_secret = webhook_secret

    const { data, error } = await supabase
      .from("payment_gateways")
      .upsert(updateData, { onConflict: 'name' })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ gateway: data })
  } catch (error) {
    console.error("Update payment gateway error:", error)
    return NextResponse.json({ error: "Failed to update payment gateway" }, { status: 500 })
  }
}
