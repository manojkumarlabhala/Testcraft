"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function PhonePeSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!searchParams) return

    const verifyPayment = async () => {
      const transactionId = searchParams.get("transactionId")
      const status = searchParams.get("status")

      if (status === "success" && transactionId) {
        try {
          // Verify payment with our backend
          const response = await fetch("/api/payments/phonepe/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ transactionId })
          })

          if (response.ok) {
            setStatus("success")
            setMessage("Payment successful! Your premium subscription is now active.")
          } else {
            setStatus("failed")
            setMessage("Payment verification failed. Please contact support.")
          }
        } catch (error) {
          setStatus("failed")
          setMessage("Payment verification failed. Please contact support.")
        }
      } else {
        setStatus("failed")
        setMessage("Payment was not successful.")
      }
    }

    verifyPayment()
  }, [searchParams])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            {status === "loading" && <Loader2 className="h-6 w-6 animate-spin" />}
            {status === "success" && <CheckCircle className="h-6 w-6 text-green-600" />}
            {status === "failed" && <XCircle className="h-6 w-6 text-red-600" />}
            Payment {status === "loading" ? "Processing" : status === "success" ? "Successful" : "Failed"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">{message}</p>

          {status === "success" && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Welcome to Testcraft Premium! You now have access to:
              </p>
              <ul className="text-sm text-left space-y-1">
                <li>• Unlimited paper downloads</li>
                <li>• AI-generated mock tests</li>
                <li>• Detailed analytics</li>
                <li>• Ad-free experience</li>
              </ul>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={() => router.push("/dashboard")}
              className="flex-1"
              variant={status === "success" ? "default" : "outline"}
            >
              Go to Dashboard
            </Button>
            {status === "failed" && (
              <Button
                onClick={() => router.push("/subscription")}
                variant="outline"
                className="flex-1"
              >
                Try Again
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
