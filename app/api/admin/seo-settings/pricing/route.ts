import { NextRequest, NextResponse } from 'next/server'

// Mock SEO settings for pricing page
const mockSeoSettings = {
  pricingPageTitle: "Affordable Pricing Plans for Students & Teachers - TestCraft India",
  pricingPageDescription: "Choose from our flexible pricing plans designed for Indian students, teachers, and institutions. Start with free mock tests or upgrade to premium features.",
  pricingPageKeywords: [
    "pricing plans", 
    "subscription", 
    "mock tests", 
    "NEET preparation", 
    "JEE preparation", 
    "affordable pricing", 
    "student plans", 
    "teacher plans",
    "institution plans",
    "competitive exams",
    "india education",
    "online learning"
  ],
  enableSchemaMarkup: true,
  enableOpenGraph: true,
  enableTwitterCards: true,
  canonicalUrl: "https://testcraft.in/pricing",
  structuredData: {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "TestCraft Subscription Plans",
    "description": "Comprehensive mock test and preparation platform for Indian competitive exams",
    "brand": {
      "@type": "Brand",
      "name": "TestCraft"
    },
    "offers": [
      {
        "@type": "Offer",
        "name": "Free Plan",
        "price": "0",
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock"
      },
      {
        "@type": "Offer",
        "name": "Premium Plan",
        "price": "299",
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock"
      },
      {
        "@type": "Offer",
        "name": "Elite Plan",
        "price": "599",
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock"
      },
      {
        "@type": "Offer",
        "name": "Institution Plan",
        "price": "2999",
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock"
      }
    ]
  }
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      ...mockSeoSettings
    })
  } catch (error) {
    console.error('Error fetching SEO settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch SEO settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const seoData = await request.json()
    
    // In a real implementation, save to database
    console.log('Updating SEO settings for pricing page:', seoData)

    return NextResponse.json({
      success: true,
      data: seoData,
      message: 'SEO settings updated successfully'
    })
  } catch (error) {
    console.error('Error updating SEO settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update SEO settings' },
      { status: 500 }
    )
  }
}