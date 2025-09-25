import { NextRequest, NextResponse } from "next/server"

// Simulated sponsored ads storage (for tracking)
let sponsoredAds = [
  {
    id: "1",
    title: "Premium Test Prep Course",
    description: "Boost your exam scores with our comprehensive test preparation courses",
    imageUrl: "https://via.placeholder.com/1200x300/4f46e5/ffffff?text=Premium+Course+Ad",
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
    imageUrl: "https://via.placeholder.com/400x400/059669/ffffff?text=Study+Books",
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

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { adId, action } = body

  const adIndex = sponsoredAds.findIndex(ad => ad.id === adId)
  if (adIndex === -1) {
    return NextResponse.json({ error: "Ad not found" }, { status: 404 })
  }

  // Update tracking metrics
  if (action === 'click') {
    sponsoredAds[adIndex].clicks += 1
  } else if (action === 'impression') {
    sponsoredAds[adIndex].impressions += 1
  }

  // Recalculate CTR
  const ad = sponsoredAds[adIndex]
  ad.ctr = ad.impressions > 0 ? (ad.clicks / ad.impressions) * 100 : 0

  return NextResponse.json({ success: true })
}