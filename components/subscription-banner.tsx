"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Crown, X } from "lucide-react"
import { PaymentModal } from "@/components/payment/payment-modal"

interface SubscriptionStatus {
  plan: string
  expiresAt?: string
  isActive: boolean
  daysRemaining: number
}

export function SubscriptionBanner() {
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null)
  const [showPayment, setShowPayment] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    fetchSubscriptionStatus()
  }, [])

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await fetch("/api/payments/subscription-status")
      if (response.ok) {
        const data = await response.json()
        setSubscription(data)
      }
    } catch (error) {
      console.error("Failed to fetch subscription status:", error)
    }
  }

  if (dismissed || !subscription || subscription.isActive) {
    return null
  }

  return (
    <>
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Crown className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Unlock Premium Features</p>
              <p className="text-sm text-muted-foreground">Get unlimited access to all papers and AI mock tests</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setShowPayment(true)} size="sm">
              Upgrade Now
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setDismissed(true)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <PaymentModal open={showPayment} onOpenChange={setShowPayment} />
    </>
  )
}
