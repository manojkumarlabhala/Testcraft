import { NextRequest, NextResponse } from "next/server"

// Simulated sponsored ads storage (same as admin API)
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

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const placement = url.searchParams.get('placement')
  
  // Filter active ads
  const activeAds = sponsoredAds.filter(ad => {
    const now = new Date()
    const startDate = new Date(ad.startDate)
    const endDate = new Date(ad.endDate)
    
    return ad.isActive && now >= startDate && now <= endDate
  })

  // Filter by placement if specified
  const filteredAds = placement 
    ? activeAds.filter(ad => ad.placement === placement)
    : activeAds

  // Sort by priority
  const sortedAds = filteredAds.sort((a, b) => a.priority - b.priority)

  return NextResponse.json({ ads: sortedAds })
}