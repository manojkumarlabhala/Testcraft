"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Users, Building, Star, Zap } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

interface SubscriptionPlan {
  id: string
  name: string
  displayName: string
  description: string
  shortDescription: string
  price: number
  originalPrice?: number
  currency: string
  billingCycle: 'monthly' | 'yearly' | 'lifetime'
  category: 'student' | 'teacher' | 'institution' | 'enterprise'
  features: string[]
  limitations: string[]
  isPopular: boolean
  isActive: boolean
  seoTitle: string
  seoDescription: string
  seoKeywords: string[]
  targetAudience: string[]
  testimonials: Array<{
    name: string
    role: string
    content: string
    rating: number
  }>
  stats: {
    totalSubscribers: number
    conversionRate: number
    churnRate: number
    averageRating: number
  }
}

export function PricingSection() {
  const router = useRouter()
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/subscription-plans')
      if (response.ok) {
        const data = await response.json()
        // Filter only active plans and sort by price
        const activePlans = data.plans
          .filter((plan: SubscriptionPlan) => plan.isActive)
          .sort((a: SubscriptionPlan, b: SubscriptionPlan) => a.price - b.price)
        setPlans(activePlans)
      }
    } catch (error) {
      console.error('Failed to fetch subscription plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'student': return <Users className="h-5 w-5" />
      case 'teacher': return <Star className="h-5 w-5" />
      case 'institution': return <Building className="h-5 w-5" />
      case 'enterprise': return <Crown className="h-5 w-5" />
      default: return <Zap className="h-5 w-5" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'student': return 'blue'
      case 'teacher': return 'green'
      case 'institution': return 'purple'
      case 'enterprise': return 'gold'
      default: return 'gray'
    }
  }

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    if (plan.price === 0) {
      // Free plan - redirect to signup
      router.push('/auth/login?plan=free')
    } else {
      // Paid plan - redirect to payment
      router.push(`/payment?plan=${plan.name}&price=${plan.price}&billing=${plan.billingCycle}`)
    }
  }

  const filteredPlans = plans.filter(plan => plan.billingCycle === 'yearly' || plan.billingCycle === 'monthly' || plan.billingCycle === 'lifetime')

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-96 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-lg p-6 h-96">
                  <div className="h-6 bg-gray-300 rounded mb-4"></div>
                  <div className="h-8 bg-gray-300 rounded mb-4"></div>
                  <div className="space-y-2">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="h-4 bg-gray-300 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-b from-blue-50 to-purple-50" id="pricing">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choose Your Perfect Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Student plans include 365 days of full access. Institution plans are billed monthly for flexible management.
          </p>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>30-day money-back guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>No hidden charges</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {filteredPlans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                plan.isPopular ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-lg'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 text-sm font-medium">
                  ⭐ Most Popular
                </div>
              )}
              
              <CardHeader className={`text-center ${plan.isPopular ? 'pt-12' : 'pt-6'}`}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  {getCategoryIcon(plan.category)}
                  <CardTitle className="text-xl">{plan.displayName}</CardTitle>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-center gap-2">
                    {plan.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        ₹{plan.originalPrice}
                      </span>
                    )}
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price === 0 ? 'Free' : `₹${plan.price}`}
                    </span>
                  </div>
                  {plan.price > 0 && (
                    <p className="text-gray-600 text-sm">
                      per {plan.billingCycle === 'monthly' ? 'month' : 'year'}
                    </p>
                  )}
                  {plan.originalPrice && plan.price > 0 && (
                    <Badge className="mt-2 bg-green-100 text-green-800">
                      Save ₹{plan.originalPrice - plan.price}
                    </Badge>
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-4">{plan.shortDescription}</p>
                
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                  <span>⭐ {plan.stats.averageRating}</span>
                  <span>👥 {plan.stats.totalSubscribers.toLocaleString()} users</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {plan.features.slice(0, 8).map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                  
                  {plan.features.length > 8 && (
                    <div className="text-xs text-gray-500 font-medium">
                      +{plan.features.length - 8} more features
                    </div>
                  )}
                  
                  {plan.limitations.length > 0 && (
                    <div className="border-t pt-3 mt-3">
                      <p className="text-xs text-gray-500 mb-2">Limitations:</p>
                      {plan.limitations.slice(0, 2).map((limitation, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <span className="text-red-400 text-sm">×</span>
                          <span className="text-xs text-gray-500">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button 
                  className={`w-full ${
                    plan.isPopular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                      : plan.price === 0
                      ? 'bg-gray-600 hover:bg-gray-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white font-medium py-3`}
                  onClick={() => handleSelectPlan(plan)}
                >
                  {plan.price === 0 ? 'Start Free' : 'Choose Plan'}
                </Button>

                {plan.testimonials.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">
                      "{plan.testimonials[0].content}"
                    </div>
                    <div className="text-xs font-medium text-gray-800">
                      - {plan.testimonials[0].name}, {plan.testimonials[0].role}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold mb-2">Can I change my plan anytime?</h4>
              <p className="text-gray-600 text-sm">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Is there a money-back guarantee?</h4>
              <p className="text-gray-600 text-sm">Yes, we offer a 30-day money-back guarantee on all paid plans. No questions asked.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">What payment methods do you accept?</h4>
              <p className="text-gray-600 text-sm">We accept UPI, credit/debit cards, net banking, and digital wallets popular in India.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Do you offer student discounts?</h4>
              <p className="text-gray-600 text-sm">Our pricing is already student-friendly. We also offer special discounts during exam seasons.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
          <p className="text-gray-600 mb-6">Our support team is here to help you choose the right plan.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" onClick={() => router.push('/contact')}>
              Contact Support
            </Button>
            <Button onClick={() => router.push('/demo')}>
              Book a Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}