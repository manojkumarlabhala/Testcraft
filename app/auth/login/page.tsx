"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Shield, Building2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      // Check if this is super admin login
      const envEmail = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAILS || "superadmin@testcraft.in";
      const envPassword = process.env.NEXT_PUBLIC_SUPER_ADMIN_PASSWORD || "Superadmin@123";

      let loginResult;
      if (email === envEmail && password === envPassword) {
        // For super admin, try to sign in, and if it fails, we'll handle it
        loginResult = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        // If login fails for super admin, try to create the user
        if (loginResult.error) {
          console.log('Super admin user not found, attempting to create...');
          try {
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email: envEmail,
              password: envPassword,
              options: {
                data: {
                  full_name: "Super Administrator",
                  role: "super_admin"
                }
              }
            });

            if (signUpError && signUpError.message !== 'User already registered') {
              throw signUpError;
            }

            // Try login again after potential signup
            loginResult = await supabase.auth.signInWithPassword({
              email,
              password,
            });
          } catch (createError) {
            console.error('Error creating super admin user:', createError);
            // Continue with original login attempt
          }
        }
      } else {
        // Regular user login
        loginResult = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      }

      if (loginResult.error) {
        throw loginResult.error;
      }

      // Successful login - redirect based on user role
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        const { isSuperAdmin } = await import("@/lib/admin/super-admin-emails");
        if (isSuperAdmin(userData.user.email)) {
          router.push("/admin/super-admin-dashboard");
        } else {
          router.push("/dashboard");
        }
      } else {
        router.push("/dashboard");
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md space-y-4">
        {/* Admin Login Options */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            asChild
            variant="outline"
            className="h-16 flex flex-col items-center justify-center space-y-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 dark:border-purple-800 dark:hover:border-purple-700 dark:hover:bg-purple-900/20"
          >
            <Link href="/auth/admin/super-admin">
              <Shield className="h-6 w-6 text-purple-600" />
              <span className="text-sm font-medium">Super Admin</span>
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-16 flex flex-col items-center justify-center space-y-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 dark:border-blue-800 dark:hover:border-blue-700 dark:hover:bg-blue-900/20"
          >
            <Link href="/auth/admin/institution">
              <Building2 className="h-6 w-6 text-blue-600" />
              <span className="text-sm font-medium">Institution Cloud</span>
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>Sign in to your Textcraft account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
            <div className="mt-4 text-center">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                ← Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
