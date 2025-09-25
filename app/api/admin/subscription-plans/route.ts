import { NextRequest, NextResponse } from 'next/server'

// Mock data for subscription plans
const mockPlans = [
  {
    id: '1',
    name: 'free',
    displayName: 'Free Plan',
    description: 'Perfect for students starting their preparation journey with basic features and limited access.',
    shortDescription: 'Basic features for beginners',
    price: 0,
    currency: 'INR',
    billingCycle: 'yearly',
    category: 'student',
    features: [
      '10 Mock Tests per month',
      'Basic Performance Analytics',
      'Community Access',
      'Mobile App Access',
      'Email Support'
    ],
    limitations: [
      'Limited test history',
      'No detailed solutions',
      'No expert doubt solving',
      'Limited analytics'
    ],
    isPopular: false,
    isActive: true,
    seoTitle: 'Free Mock Tests for NEET & JEE - Start Your Preparation',
    seoDescription: 'Get started with free mock tests for NEET, JEE, and CBSE. Limited access with basic features perfect for beginners.',
    seoKeywords: ['free mock tests', 'free NEET preparation', 'free JEE tests', 'CBSE practice'],
    targetAudience: ['New students', 'Budget-conscious learners', 'Trial users'],
    testimonials: [
      {
        name: 'Priya Sharma',
        role: 'NEET Aspirant',
        content: 'Great way to start practicing without any cost!',
        rating: 4
      }
    ],
    stats: {
      totalSubscribers: 12450,
      conversionRate: 23.5,
      churnRate: 0,
      averageRating: 4.1
    },
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'premium',
    displayName: 'Premium Plan',
    description: 'Comprehensive preparation package with unlimited tests, detailed analytics, and expert support for serious aspirants.',
    shortDescription: 'Complete preparation solution',
    price: 299,
    originalPrice: 399,
    currency: 'INR',
    billingCycle: 'yearly',
    category: 'student',
    features: [
      'Unlimited Mock Tests',
      'Detailed Performance Analytics',
      'Expert Doubt Solving',
      'Video Solutions',
      'Previous Year Papers',
      'Study Materials (PDF)',
      'Priority Support',
      'Mobile & Web Access'
    ],
    limitations: [
      'No 1-on-1 mentorship',
      'No live classes'
    ],
    isPopular: true,
    isActive: true,
    seoTitle: 'Premium Mock Tests ₹299/year - NEET, JEE, CBSE Preparation',
    seoDescription: 'Premium subscription with unlimited mock tests, expert doubt solving, and detailed analytics. Perfect for NEET, JEE, and CBSE preparation.',
    seoKeywords: ['premium mock tests', 'NEET preparation premium', 'JEE premium plan', 'unlimited tests', 'expert support'],
    targetAudience: ['Serious aspirants', 'Regular users', 'Students needing expert help'],
    testimonials: [
      {
        name: 'Arjun Patel',
        role: 'JEE Aspirant',
        content: 'Amazing value for money! The detailed analytics helped me improve significantly.',
        rating: 5
      },
      {
        name: 'Sneha Gupta',
        role: 'NEET Student',
        content: 'Expert doubt solving is a game-changer. Highly recommended!',
        rating: 5
      }
    ],
    stats: {
      totalSubscribers: 8930,
      conversionRate: 18.2,
      churnRate: 12.5,
      averageRating: 4.6
    },
    createdAt: '2024-01-01',
    updatedAt: '2024-01-20'
  },
  {
    id: '3',
    name: 'elite',
    displayName: 'Elite Plan',
    description: 'Ultimate preparation experience with 1-on-1 mentorship, live classes, and personalized study plans for top performers.',
    shortDescription: '1-on-1 mentorship & live classes',
    price: 599,
    originalPrice: 799,
    currency: 'INR',
    billingCycle: 'yearly',
    category: 'student',
    features: [
      'Everything in Premium',
      '1-on-1 Weekly Mentorship',
      'Live Interactive Classes',
      'Personalized Study Plans',
      'Custom Mock Tests',
      'Advanced Analytics & Reports',
      'WhatsApp Support Group',
      'Recorded Class Access',
      'Priority Test Evaluation'
    ],
    limitations: [],
    isPopular: false,
    isActive: true,
    seoTitle: 'Elite Plan ₹599/year - 1-on-1 Mentorship for NEET & JEE',
    seoDescription: 'Elite subscription with personal mentorship, live classes, and custom study plans. Best for serious NEET and JEE aspirants.',
    seoKeywords: ['elite plan', 'personal mentorship', 'live classes', 'NEET mentorship', 'JEE coaching', 'premium coaching'],
    targetAudience: ['Top aspirants', 'Students needing personal guidance', 'Competitive exam toppers'],
    testimonials: [
      {
        name: 'Rohit Kumar',
        role: 'JEE Topper',
        content: 'The personal mentorship helped me crack JEE Advanced. Worth every penny!',
        rating: 5
      }
    ],
    stats: {
      totalSubscribers: 2340,
      conversionRate: 8.7,
      churnRate: 6.2,
      averageRating: 4.8
    },
    createdAt: '2024-01-01',
    updatedAt: '2024-01-22'
  },
  {
    id: '4',
    name: 'institution',
    displayName: 'Institution Plan',
    description: 'Comprehensive solution for schools, colleges, and coaching institutes with bulk student management and advanced reporting.',
    shortDescription: 'Bulk student management for institutions',
    price: 14999,
    currency: 'INR',
    billingCycle: 'monthly',
    category: 'institution',
    features: [
      'Up to 500 Students',
      'Institution Dashboard',
      'Bulk Test Assignment',
      'Detailed Class Reports',
      'Parent Communication Portal',
      'Custom Branding',
      'Advanced Analytics',
      'API Access',
      'Dedicated Support Manager',
      'Teacher Training Sessions'
    ],
    limitations: [
      'Additional charges for >500 students'
    ],
    isPopular: false,
    isActive: true,
    seoTitle: 'Institution Plan ₹14999/month - School & Coaching Institute Solution',
    seoDescription: 'Complete digital testing solution for schools and coaching institutes. Manage up to 500 students with advanced reporting.',
    seoKeywords: ['institution plan', 'school management', 'coaching institute', 'bulk student management', 'educational institution'],
    targetAudience: ['Schools', 'Coaching institutes', 'Educational organizations', 'Teachers'],
    testimonials: [
      {
        name: 'Dr. Rajesh Agarwal',
        role: 'Principal, ABC School',
        content: 'Excellent platform for managing our students\' test preparation. Great reporting features!',
        rating: 5
      }
    ],
    stats: {
      totalSubscribers: 156,
      conversionRate: 15.6,
      churnRate: 8.9,
      averageRating: 4.7
    },
    createdAt: '2024-01-01',
    updatedAt: '2024-01-25'
  }
]

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      plans: mockPlans
    })
  } catch (error) {
    console.error('Error fetching subscription plans:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscription plans' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const planData = await request.json()
    
    // Generate new ID
    const newPlan = {
      ...planData,
      id: Math.random().toString(36).substring(2, 15),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: {
        totalSubscribers: 0,
        conversionRate: 0,
        churnRate: 0,
        averageRating: 0
      }
    }

    // In a real implementation, save to database
    console.log('Creating new subscription plan:', newPlan)

    return NextResponse.json({
      success: true,
      plan: newPlan,
      message: 'Subscription plan created successfully'
    })
  } catch (error) {
    console.error('Error creating subscription plan:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create subscription plan' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Plan ID is required' },
        { status: 400 }
      )
    }

    const planData = await request.json()
    
    // In a real implementation, update in database
    console.log('Updating subscription plan:', id, planData)

    const updatedPlan = {
      ...planData,
      id,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      plan: updatedPlan,
      message: 'Subscription plan updated successfully'
    })
  } catch (error) {
    console.error('Error updating subscription plan:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update subscription plan' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Plan ID is required' },
        { status: 400 }
      )
    }

    // In a real implementation, delete from database
    console.log('Deleting subscription plan:', id)

    return NextResponse.json({
      success: true,
      message: 'Subscription plan deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting subscription plan:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete subscription plan' },
      { status: 500 }
    )
  }
}