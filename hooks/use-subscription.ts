"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface SubscriptionStatus {
  plan: string
  isActive: boolean
  daysRemaining: number
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    checkSubscription()
  }, [])

  const checkSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setSubscription({ plan: 'free', isActive: false, daysRemaining: 0 })
        setLoading(false)
        return
      }

      // Special handling for test user
      if (user.email === 'student.elite@testcraft.in') {
        setSubscription({
          plan: "Student Elite",
          isActive: true,
          daysRemaining: 365,
        })
        setLoading(false)
        return
      }

      const response = await fetch('/api/payments/subscription-status', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setSubscription(data)
      } else {
        setSubscription({ plan: 'free', isActive: false, daysRemaining: 0 })
      }
    } catch (error) {
      console.error('Error checking subscription:', error)
      setSubscription({ plan: 'free', isActive: false, daysRemaining: 0 })
    } finally {
      setLoading(false)
    }
  }

  const isPremium = subscription?.plan === 'Student Elite' || subscription?.plan === 'Student Premium'

  return {
    subscription,
    loading,
    isPremium,
    checkSubscription
  }
}
