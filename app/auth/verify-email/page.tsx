"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Mail, RefreshCw } from "lucide-react"
import { useState } from "react"

export default function VerifyEmailPage() {
  const [isResending, setIsResending] = useState(false)
  const [resendMessage, setResendMessage] = useState<string | null>(null)

  const handleResendEmail = async () => {
    setIsResending(true)
    setResendMessage(null)

    try {
      // Get user email from localStorage or session
      const userData = localStorage.getItem('sb-user-data')
      let email = null

      if (userData) {
        const parsed = JSON.parse(userData)
        email = parsed.email
      }

      if (!email) {
        setResendMessage("Unable to find your email. Please try logging in again.")
        return
      }

      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setResendMessage("Verification email sent successfully! Please check your inbox.")
      } else {
        setResendMessage(data.error || "Failed to resend verification email.")
      }
    } catch (error) {
      setResendMessage("An error occurred. Please try again.")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
            <CardDescription>We've sent you a verification link</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Please check your email and click the verification link to activate your account. You may need to check
              your spam folder.
            </p>

            {resendMessage && (
              <div className={`p-3 rounded-md text-sm ${
                resendMessage.includes("successfully")
                  ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-200"
                  : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-200"
              }`}>
                {resendMessage}
              </div>
            )}

            <div className="space-y-2">
              <Button
                onClick={handleResendEmail}
                disabled={isResending}
                variant="outline"
                className="w-full"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Resend Verification Email
                  </>
                )}
              </Button>

              <Button asChild className="w-full">
                <Link href="/auth/login">Back to Login</Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
