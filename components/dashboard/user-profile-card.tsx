"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Calendar, Award, Crown, Star, ArrowUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UserProfile {
  id: string
  email: string
  full_name: string | null
  class: string | null
  exam_board: string | null
  subscription_plan: string
  created_at: string
}

interface SubscriptionStatus {
  plan: string
  isActive: boolean
  expiresAt: string | null
  daysRemaining: number
}

export function UserProfileCard() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      const [profileRes, subscriptionRes] = await Promise.all([
        fetch("/api/user/profile").catch(() => ({ ok: false })),
        fetch("/api/payments/subscription-status")
      ])

      let subscriptionData: any = null

      if (subscriptionRes.ok) {
        subscriptionData = await subscriptionRes.json()
        setSubscription(subscriptionData)
      }

      if (profileRes.ok && 'json' in profileRes) {
        const profileData = await profileRes.json()
        setProfile({ ...profileData.profile, email: profileData.email })
      } else {
        // If profile doesn't exist, try to get basic info from subscription API
        if (subscriptionData) {
          setProfile({
            id: 'temp',
            email: 'Loading...',
            full_name: null,
            class: null,
            exam_board: null,
            subscription_plan: subscriptionData.plan,
            created_at: new Date().toISOString()
          })
        }
      }
    } catch (error) {
      console.error("Failed to fetch profile data:", error)
      toast({
        title: "Error",
        description: "Failed to load profile information",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case "Student Elite":
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
      case "Student Premium":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getUpgradeSuggestion = (currentPlan: string) => {
    switch (currentPlan) {
      case "free":
        return {
          nextPlan: "Student Premium",
          benefits: ["Access to premium mock tests", "Advanced analytics", "Priority support"],
          price: "₹299/year"
        }
      case "Student Premium":
        return {
          nextPlan: "Student Elite",
          benefits: ["AI-powered personal tutor", "Unlimited mock tests", "Custom study plans", "24/7 AI support"],
          price: "₹599/year"
        }
      case "Student Elite":
        return null
      default:
        return {
          nextPlan: "Student Premium",
          benefits: ["Access to premium mock tests", "Advanced analytics", "Priority support"],
          price: "₹299/year"
        }
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!profile || !subscription) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Unable to load profile information</p>
        </CardContent>
      </Card>
    )
  }

  const upgradeSuggestion = getUpgradeSuggestion(subscription.plan)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Full Name</span>
              </div>
              <p className="text-sm text-muted-foreground">{profile.full_name || "Not provided"}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Email</span>
              </div>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Class</span>
              </div>
              <p className="text-sm text-muted-foreground">{profile.class || "Not specified"}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Exam Board</span>
              </div>
              <p className="text-sm text-muted-foreground">{profile.exam_board || "Not specified"}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Member Since</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {new Date(profile.created_at).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Subscription Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Current Plan</p>
              <Badge className={getPlanBadgeColor(subscription.plan)}>
                {subscription.plan}
              </Badge>
            </div>
            <div className="text-right space-y-1">
              <p className="text-sm font-medium">Status</p>
              <Badge variant={subscription.isActive ? "default" : "secondary"}>
                {subscription.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>

          {subscription.expiresAt && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Expires On</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {new Date(subscription.expiresAt).toLocaleDateString('en-IN')}
                {subscription.daysRemaining > 0 && (
                  <span className="ml-2 text-xs">
                    ({subscription.daysRemaining} days remaining)
                  </span>
                )}
              </p>
            </div>
          )}

          {upgradeSuggestion && (
            <>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <ArrowUp className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Upgrade to {upgradeSuggestion.nextPlan}</span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Benefits include:</p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    {upgradeSuggestion.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-lg font-semibold text-primary">{upgradeSuggestion.price}</span>
                  <Button onClick={() => window.location.href = '/subscription'}>
                    Upgrade Now
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
