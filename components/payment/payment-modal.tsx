"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Zap } from "lucide-react"
import { useRouter } from "next/navigation"

interface PaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedPlan?: string
}

declare global {
  interface Window {
    Razorpay: any
  }
}

const plans = [
  {
    id: "student-premium",
    name: "Student Premium",
    price: 299,
    duration: "year",
    features: [
      "Unlimited paper downloads",
      "Access to all premium papers",
      "Basic mock tests",
      "Performance analytics",
      "Email support",
    ],
    popular: false,
  },
  {
    id: "student-elite",
    name: "Student Elite",
    price: 599,
    duration: "year",
    features: [
      "Everything in Premium",
      "AI-generated mock tests",
      "AI personal support chat",
      "Advanced analytics & insights",
      "Priority support",
      "Free updates & new features",
    ],
    popular: true,
  },
]

export function PaymentModal({ open, onOpenChange, selectedPlan }: PaymentModalProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [selectedGateway, setSelectedGateway] = useState<string>("razorpay")
  const router = useRouter()

  const handlePayment = async (planType: string, amount: number) => {
    setLoading(planType)

    try {
      // Create order with selected gateway
      const orderResponse = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planType, amount, gateway: selectedGateway }),
      })

      if (!orderResponse.ok) {
        throw new Error("Failed to create order")
      }

      const orderData = await orderResponse.json()

      if (selectedGateway === "razorpay") {
        // Initialize Razorpay
        const options = {
          key: orderData.key,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "Textcraft",
          description: `${planType} Premium Subscription`,
          order_id: orderData.orderId,
          handler: async (response: any) => {
            try {
              // Verify payment
              const verifyResponse = await fetch("/api/payments/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(response),
              })

              if (!verifyResponse.ok) {
                throw new Error("Payment verification failed")
              }

              const verifyData = await verifyResponse.json()

              if (verifyData.success) {
                onOpenChange(false)
                router.push("/dashboard?payment=success")
              } else {
                throw new Error("Payment verification failed")
              }
            } catch (error) {
              console.error("Payment verification error:", error)
              alert("Payment verification failed. Please contact support.")
            }
          },
          prefill: {
            name: "",
            email: "manojkumarlabhala354@gmail.com",
            contact: "",
          },
          modal: {
            ondismiss: function() {
              console.log("Razorpay modal dismissed");
            }
          },
          theme: {
            color: "#3B82F6",
          },
        }

        const rzp = new window.Razorpay(options)
        rzp.open()
      } else if (selectedGateway === "phonepe") {
        // Redirect to PhonePe payment URL
        if (orderData.paymentUrl) {
          window.location.href = orderData.paymentUrl
        } else {
          throw new Error("PhonePe payment URL not available")
        }
      }
    } catch (error) {
      console.error("Payment error:", error)
      alert("Payment failed. Please try again.")
    } finally {
      setLoading(null)
    }
  }

  return (
    <>
      <script src="https://checkout.razorpay.com/v1/checkout.js" />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">Choose Your Premium Plan</DialogTitle>
          </DialogHeader>

          {/* Payment Gateway Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Select Payment Method</h3>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gateway"
                  value="razorpay"
                  checked={selectedGateway === "razorpay"}
                  onChange={(e) => setSelectedGateway(e.target.value)}
                />
                <span>Razorpay</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gateway"
                  value="phonepe"
                  checked={selectedGateway === "phonepe"}
                  onChange={(e) => setSelectedGateway(e.target.value)}
                />
                <span>PhonePe</span>
              </label>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {plans.filter(plan => !selectedPlan || plan.id === selectedPlan).map((plan) => (
              <Card key={plan.id} className={`relative ${plan.popular ? "border-primary" : ""}`}>
                {plan.popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">
                    <Crown className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    {plan.name}
                  </CardTitle>
                  <CardDescription>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-3xl font-bold">₹{plan.price}</span>
                      <span className="text-muted-foreground">/{plan.duration}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => handlePayment(plan.id, plan.price)}
                    disabled={loading !== null}
                  >
                    {loading === plan.id ? "Processing..." : `Choose ${plan.name}`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center text-sm text-muted-foreground mt-4">
            <p>Secure payment powered by {selectedGateway === "razorpay" ? "Razorpay" : "PhonePe"} • Cancel anytime</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
