import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server-client"
import { isSuperAdmin } from "@/lib/admin/super-admin-emails"

// Simulated ad settings storage (replace with Supabase table)
let adSettings = {
  adsEnabled: true,
  adNetwork: "Google AdSense",
  adPlacement: "Home Page",
  adRevenue: 1234.56,
}

export async function GET(req: NextRequest) {
  const supabase = createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !isSuperAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  // TODO: Fetch from Supabase
  return NextResponse.json(adSettings)
}

export async function POST(req: NextRequest) {
  const supabase = createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !isSuperAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const body = await req.json()
  adSettings = { ...adSettings, ...body }
  return NextResponse.json({ success: true, adSettings })
}
