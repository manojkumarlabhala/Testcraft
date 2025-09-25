import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server-client"
import { isSuperAdmin } from "@/lib/admin/super-admin-emails"

// Enhanced ad settings storage
let adSettings = {
  adsEnabled: true,
  adNetwork: "Google AdSense",
  maxAdsPerPage: 3,
  adRefreshRate: 30,
  showAdsToEliteUsers: false,
  adSizes: {
    banner: { width: 970, height: 250 }, // Increased size
    square: { width: 400, height: 400 }, // Increased size
    leaderboard: { width: 1200, height: 300 }, // Increased size
    skyscraper: { width: 350, height: 900 } // Increased size
  }
}

export async function GET(req: NextRequest) {
  const supabase = createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !isSuperAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

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
  return NextResponse.json({ success: true, settings: adSettings })
}