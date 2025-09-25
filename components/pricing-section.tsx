"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

const plans = [
  {
    name: "Free Forever",
    price: 0,
    originalPrice: null,
    period: null,
    features: [
      "Unlimited papers access",
      "Basic mock tests", 
      "Limited analytics",
      "Community access",
      "Mobile app access"
    ],
    popular: false,
    badge: "Perfect for Trial",
    color: "gray",
  },
  {
    name: "Student Premium",
    price: 299,
    originalPrice: 499,
    period: "year",
    features: [
      "Unlimited papers access",
      "AI-powered mock tests",
      "Detailed performance analytics", 
      "Download PDFs",
      "Smart study planner",
      "Ad-free experience",
      "Previous 10 years papers",
      "Mobile & web access",
      "Email support"
    ],
    popular: true,
    badge: "Most Popular",
    color: "purple",
    savings: "Save ₹200",
  },
  {
    name: "Student Elite",
    price: 599,
    originalPrice: 899,
    period: "year",
    features: [
      "Everything in Premium",
      "1 on 1 AI mentorship",
      "AI tutor",
      "Personalized study recommendations",
      "Advanced analytics dashboard",
      "Mock test performance comparison",
      "Priority customer support",
      "Exclusive study materials"
    ],
    popular: false,
    badge: "Recommended",
    color: "gradient",
    savings: "Save ₹300",
  },
  {
    name: "Teacher/Institution",
    price: 14999,
    originalPrice: 29999,
    period: "month",
    features: [
      "Up to 50 student accounts",
      "Classroom management tools",
      "Custom exam creation",
      "Bulk paper assignments",
      "Student progress tracking",
      "Institution branding",
      "Advanced analytics dashboard",
      "Priority support",
      "Training sessions",
      "Custom integrations"
    ],
    popular: false,
    badge: "For Educators",
    color: "emerald",
    savings: "Save ₹15000",
  },
]

export function PricingSection() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    async function checkAuth() {
      try {
        const { createClient } = await import("@/lib/supabase/client")
        const supabase = createClient()
        const { data } = await supabase.auth.getUser()
        setIsLoggedIn(!!data?.user)
      } catch {
        setIsLoggedIn(false)
      }
    }
    checkAuth()
    setIsClient(true)
  }, [])

  const handleSelectPlan = (planName: string) => {
    if (!isLoggedIn) {
      router.push('/login')
      return
    }
    if (planName === "Free") {
      alert("You are already on the Free plan.")
      return
    }
    // Redirect to subscription page or payment
    router.push('/subscription')
  }

  const getColorClasses = (color: string, isPopular: boolean) => {
    const baseClasses = "relative transition-all duration-300 hover:scale-105 hover:shadow-2xl"
    
    switch (color) {
      case "purple":
        return `${baseClasses} border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 ${isPopular ? "shadow-xl scale-105 ring-2 ring-purple-300 dark:ring-purple-700" : ""}`
      case "gradient":
        return `${baseClasses} border-transparent bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-orange-900/20 dark:via-pink-900/20 dark:to-purple-900/20 shadow-lg`
      case "emerald":
        return `${baseClasses} border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20`
      default:
        return `${baseClasses} border-border/50 hover:shadow-xl`
    }
  }

  const getBadgeClasses = (color: string) => {
    switch (color) {
      case "purple":
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
      case "gradient":
        return "bg-gradient-to-r from-orange-500 to-pink-500 text-white"
      case "emerald":
        return "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
      default:
        return "bg-primary text-white"
    }
  }

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-slate-50 to-purple-50/30 dark:from-slate-950 dark:to-purple-950/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            💰 Special Launch Pricing - Limited Time
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6">
            Choose Your Success Plan
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            🎯 <strong>Join 50,000+ students</strong> who've already improved their scores by 40% on average with our affordable plans designed specifically for Indian students and educators
          </p>
          
          {/* Money Back Guarantee */}
          <div className="mt-6 inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/20 px-4 py-2 rounded-full border border-green-200 dark:border-green-800">
            <Check className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-800 dark:text-green-200">30-Day Money Back Guarantee</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-12">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={getColorClasses(plan.color, plan.popular)}
            >
              {plan.badge && (
                <Badge className={`absolute -top-3 left-1/2 transform -translate-x-1/2 ${getBadgeClasses(plan.color)} px-3 py-1 text-xs font-bold`}>
                  {plan.badge}
                </Badge>
              )}

              {plan.savings && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                  {plan.savings}
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-black mb-2">{plan.name}</CardTitle>
                
                <div className="mb-4">
                  {plan.originalPrice && (
                    <div className="text-lg text-muted-foreground line-through mb-1">
                      ₹{isClient ? plan.originalPrice.toLocaleString() : plan.originalPrice}
                    </div>
                  )}
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-black text-foreground">
                      ₹{isClient ? plan.price.toLocaleString() : plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-muted-foreground font-medium">/{plan.period}</span>
                    )}
                  </div>
                  {plan.period && plan.period !== "month" && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Just ₹{Math.round(plan.price / 12)}/month
                    </p>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full font-bold py-3 ${
                    plan.popular 
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg" 
                      : plan.color === "gradient"
                      ? "bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-0"
                      : ""
                  }`}
                  variant={plan.popular || plan.color === "gradient" ? "default" : "outline"}
                  onClick={() => handleSelectPlan(plan.name)}
                >
                  {plan.price === 0 ? "Start Free Trial" : `Get ${plan.name} Plan`}
                </Button>

                {plan.price > 0 && (
                  <p className="text-xs text-center text-muted-foreground mt-3">
                    🔒 Secure payment • Cancel anytime
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Trust Signals */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Used by 500+ Schools</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Trusted by 50,000+ Students</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>4.9★ Rating</span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            💡 <strong>Special Student Discount:</strong> Show your student ID for additional 20% off on annual plans. 
            <br />
            📧 Contact support@testcraft.in for group discounts and school partnerships.
          </p>
        </div>
      </div>
    </section>
  )
}
