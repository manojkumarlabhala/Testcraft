"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PaymentModal } from "@/components/payment/payment-modal"
import { Crown, Calendar, CreditCard, CheckCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface SubscriptionStatus {
  plan: string
  expiresAt?: string
  isActive: boolean
  daysRemaining: number
}

interface PaymentHistory {
  id: string
  amount: number
  plan_type: string
  transaction_date: string
  status: string
}

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null)
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([])
  const [showPayment, setShowPayment] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string>("student-premium")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [subscriptionRes, historyRes] = await Promise.all([
        fetch("/api/payments/subscription-status", { credentials: 'include' }),
        fetch("/api/user/payment-history", { credentials: 'include' }),
      ])

      if (subscriptionRes.ok) {
        const subscriptionData = await subscriptionRes.json()
        setSubscription(subscriptionData)
      } else if (subscriptionRes.status === 401) {
        // Unauthenticated: ensure UI treats user as free
        setSubscription({ plan: 'free', isActive: false, daysRemaining: 0 })
      }

      if (historyRes.ok) {
        const historyData = await historyRes.json()
        setPaymentHistory(historyData.history || [])
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Subscription</h1>
            <p className="text-muted-foreground">Manage your premium subscription</p>
          </div>

          {/* Current Subscription */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Current Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              {subscription?.isActive ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge variant="default" className="mb-2">
                        {subscription.plan.toUpperCase()} PREMIUM
                      </Badge>
                      <p className="text-sm text-muted-foreground">{subscription.daysRemaining} days remaining</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        Expires{" "}
                        {subscription.expiresAt
                          ? formatDistanceToNow(new Date(subscription.expiresAt), { addSuffix: true })
                          : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Active subscription</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Badge variant="secondary">FREE PLAN</Badge>
                  <p className="text-muted-foreground">
                    Choose the perfect plan for your exam preparation needs.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <Card className="border-primary/20">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Crown className="h-5 w-5 text-primary" />
                          Student Premium
                        </CardTitle>
                        <CardDescription>
                          Perfect for dedicated students preparing for exams
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold mb-4">₹299<span className="text-sm font-normal">/year</span></div>
                        <ul className="space-y-2 text-sm mb-4">
                          <li>• Unlimited paper downloads</li>
                          <li>• Access to premium papers</li>
                          <li>• Basic mock tests</li>
                          <li>• Performance analytics</li>
                        </ul>
                        <Button className="w-full" onClick={() => { setSelectedPlan("student-premium"); setShowPayment(true); }}>
                          Choose Premium
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="border-primary relative">
                      <Badge className="absolute -top-2 left-4 bg-primary">Most Popular</Badge>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Crown className="h-5 w-5 text-primary" />
                          Student Elite
                        </CardTitle>
                        <CardDescription>
                          Complete solution with AI-powered learning
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold mb-4">₹599<span className="text-sm font-normal">/year</span></div>
                        <ul className="space-y-2 text-sm mb-4">
                          <li>• Everything in Premium</li>
                          <li>• AI-generated mock tests</li>
                          <li>• AI personal support chat</li>
                          <li>• Advanced analytics</li>
                          <li>• Priority support</li>
                        </ul>
                        <Button className="w-full" variant="default" onClick={() => { setSelectedPlan("student-elite"); setShowPayment(true); }}>
                          Choose Elite
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment History
              </CardTitle>
              <CardDescription>Your recent transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {paymentHistory.length === 0 ? (
                <p className="text-muted-foreground">No payment history found.</p>
              ) : (
                <div className="space-y-4">
                  {paymentHistory.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{payment.plan_type.toUpperCase()} Premium</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(payment.transaction_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{payment.amount}</p>
                        <Badge variant={payment.status === "completed" ? "default" : "secondary"}>
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <PaymentModal open={showPayment} onOpenChange={setShowPayment} selectedPlan={selectedPlan} />
    </div>
  )
}
