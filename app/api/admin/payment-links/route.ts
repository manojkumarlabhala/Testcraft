import { NextRequest, NextResponse } from "next/server"

// For now, let's disable authentication to test the functionality
// In production, you should enable proper authentication
const BYPASS_AUTH = true

// Simulated payment links storage (replace with Supabase table)
let paymentLinks = [
  {
    id: '1',
    title: 'Student Elite Monthly',
    amount: 299,
    currency: 'INR',
    planType: 'student-elite-monthly',
    url: 'https://testcraft.in/pay/student-elite-monthly',
    isActive: true,
    clicks: 156,
    conversions: 43,
    conversionRate: 27.6,
    totalRevenue: 12857,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    title: 'Student Premium Annual',
    amount: 1999,
    currency: 'INR',
    planType: 'student-premium-annual',
    url: 'https://testcraft.in/pay/student-premium-annual',
    isActive: true,
    clicks: 89,
    conversions: 24,
    conversionRate: 27.0,
    totalRevenue: 47976,
    createdAt: '2024-01-20T14:20:00Z',
    updatedAt: '2024-01-20T14:20:00Z'
  },
  {
    id: '3',
    title: 'Student Elite Annual',
    amount: 2999,
    currency: 'INR',
    planType: 'student-elite-annual',
    url: 'https://testcraft.in/pay/student-elite-annual',
    isActive: true,
    clicks: 67,
    conversions: 18,
    conversionRate: 26.9,
    totalRevenue: 53982,
    createdAt: '2024-01-25T09:15:00Z',
    updatedAt: '2024-01-25T09:15:00Z'
  }
]

export async function GET(req: NextRequest) {
  // Bypass authentication for testing
  if (!BYPASS_AUTH) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  // Calculate totals
  const totalRevenue = paymentLinks.reduce((sum, link) => sum + link.totalRevenue, 0)
  const totalClicks = paymentLinks.reduce((sum, link) => sum + link.clicks, 0)
  const totalConversions = paymentLinks.reduce((sum, link) => sum + link.conversions, 0)
  const averageConversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0

  return NextResponse.json({
    links: paymentLinks,
    stats: {
      totalRevenue,
      totalClicks,
      totalConversions,
      averageConversionRate: parseFloat(averageConversionRate.toFixed(2))
    }
  })
}

export async function POST(req: NextRequest) {
  // Bypass authentication for testing
  if (!BYPASS_AUTH) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const body = await req.json()
  
  // Generate URL-friendly slug from title
  const slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  
  const newLink = {
    id: Date.now().toString(),
    title: body.title,
    amount: body.amount,
    currency: body.currency || 'INR',
    planType: body.planType,
    url: `https://testcraft.in/pay/${slug}`,
    isActive: true,
    clicks: 0,
    conversions: 0,
    conversionRate: 0,
    totalRevenue: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  paymentLinks.push(newLink)
  return NextResponse.json({ success: true, link: newLink })
}

export async function PUT(req: NextRequest) {
  // Bypass authentication for testing
  if (!BYPASS_AUTH) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const body = await req.json()
  const { id, ...updateData } = body
  
  const linkIndex = paymentLinks.findIndex(link => link.id === id)
  if (linkIndex === -1) {
    return NextResponse.json({ error: "Payment link not found" }, { status: 404 })
  }

  paymentLinks[linkIndex] = {
    ...paymentLinks[linkIndex],
    ...updateData,
    updatedAt: new Date().toISOString()
  }

  return NextResponse.json({ success: true, link: paymentLinks[linkIndex] })
}

export async function DELETE(req: NextRequest) {
  // Bypass authentication for testing
  if (!BYPASS_AUTH) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const url = new URL(req.url)
  const id = url.searchParams.get('id')
  
  if (!id) {
    return NextResponse.json({ error: "Payment link ID required" }, { status: 400 })
  }

  const linkIndex = paymentLinks.findIndex(link => link.id === id)
  if (linkIndex === -1) {
    return NextResponse.json({ error: "Payment link not found" }, { status: 404 })
  }

  paymentLinks.splice(linkIndex, 1)
  return NextResponse.json({ success: true })
}