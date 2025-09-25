import { NextRequest, NextResponse } from "next/server"

// Enhanced ad settings storage (same as admin API)
let adSettings = {
  adsEnabled: true,
  adNetwork: "Google AdSense",
  maxAdsPerPage: 3,
  adRefreshRate: 30,
  showAdsToEliteUsers: false,
  adSizes: {
    banner: { width: 970, height: 250 },
    square: { width: 400, height: 400 },
    leaderboard: { width: 1200, height: 300 },
    skyscraper: { width: 350, height: 900 }
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json(adSettings)
}