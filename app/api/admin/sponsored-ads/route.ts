import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server-client"
import { isSuperAdmin } from "@/lib/admin/super-admin-emails"

// Simulated sponsored ads storage (replace with Supabase table)
let sponsoredAds = [
  {
    id: "1",
    title: "Premium Test Prep Course",
    description: "Boost your exam scores with our comprehensive test preparation courses",
    imageUrl: "https://via.placeholder.com/728x120/4f46e5/ffffff?text=Premium+Course",
    targetUrl: "https://example.com/premium-course",
    isActive: true,
    placement: "home",
    priority: 1,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    budget: 250000,
    clicks: 1234,
    impressions: 45678,
    ctr: 2.7,
    cost: 65000.50,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "2",
    title: "Study Materials & Books",
    description: "Get the best study materials and reference books for competitive exams",
    imageUrl: "https://via.placeholder.com/350x350/059669/ffffff?text=Study+Books",
    targetUrl: "https://example.com/study-books",
    isActive: true,
    placement: "sidebar",
    priority: 2,
    startDate: "2024-01-15",
    endDate: "2024-06-30",
    budget: 150000,
    clicks: 890,
    impressions: 23456,
    ctr: 3.8,
    cost: 34500.25,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-20T14:20:00Z"
  }
]

export async function GET(req: NextRequest) {
  const supabase = createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !isSuperAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  // Calculate totals
  const totalRevenue = sponsoredAds.reduce((sum, ad) => sum + ad.cost, 0)
  const totalClicks = sponsoredAds.reduce((sum, ad) => sum + ad.clicks, 0)
  const totalImpressions = sponsoredAds.reduce((sum, ad) => sum + ad.impressions, 0)

  return NextResponse.json({
    ads: sponsoredAds,
    totalRevenue,
    totalClicks,
    totalImpressions
  })
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
  const newAd = {
    id: Date.now().toString(),
    ...body,
    clicks: 0,
    impressions: 0,
    ctr: 0,
    cost: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  sponsoredAds.push(newAd)
  return NextResponse.json({ success: true, ad: newAd })
}