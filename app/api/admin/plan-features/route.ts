import { NextRequest, NextResponse } from 'next/server'

// Mock features data
const mockFeatures = [
  { 
    id: '1', 
    name: 'Mock Tests', 
    description: 'Access to practice tests and assessments', 
    category: 'Testing', 
    isCore: true, 
    isActive: true 
  },
  { 
    id: '2', 
    name: 'Performance Analytics', 
    description: 'Detailed performance insights and reports', 
    category: 'Analytics', 
    isCore: true, 
    isActive: true 
  },
  { 
    id: '3', 
    name: 'Expert Doubt Solving', 
    description: '24/7 expert support for clearing doubts', 
    category: 'Support', 
    isCore: false, 
    isActive: true 
  },
  { 
    id: '4', 
    name: 'Live Classes', 
    description: 'Interactive live learning sessions', 
    category: 'Learning', 
    isCore: false, 
    isActive: true 
  },
  { 
    id: '5', 
    name: '1-on-1 Mentorship', 
    description: 'Personal guidance from subject experts', 
    category: 'Mentorship', 
    isCore: false, 
    isActive: true 
  },
  { 
    id: '6', 
    name: 'Video Solutions', 
    description: 'Detailed video explanations for problems', 
    category: 'Learning', 
    isCore: false, 
    isActive: true 
  },
  { 
    id: '7', 
    name: 'Study Materials', 
    description: 'Comprehensive study resources and notes', 
    category: 'Resources', 
    isCore: false, 
    isActive: true 
  },
  { 
    id: '8', 
    name: 'Previous Year Papers', 
    description: 'Access to previous years exam papers', 
    category: 'Testing', 
    isCore: false, 
    isActive: true 
  },
  { 
    id: '9', 
    name: 'Mobile App Access', 
    description: 'Full access via mobile applications', 
    category: 'Platform', 
    isCore: true, 
    isActive: true 
  },
  { 
    id: '10', 
    name: 'Custom Branding', 
    description: 'White-label solution with custom branding', 
    category: 'Institution', 
    isCore: false, 
    isActive: true 
  }
]

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      features: mockFeatures
    })
  } catch (error) {
    console.error('Error fetching plan features:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch plan features' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const featureData = await request.json()
    
    const newFeature = {
      ...featureData,
      id: Math.random().toString(36).substring(2, 15),
      isActive: true
    }

    console.log('Creating new plan feature:', newFeature)

    return NextResponse.json({
      success: true,
      feature: newFeature,
      message: 'Plan feature created successfully'
    })
  } catch (error) {
    console.error('Error creating plan feature:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create plan feature' },
      { status: 500 }
    )
  }
}