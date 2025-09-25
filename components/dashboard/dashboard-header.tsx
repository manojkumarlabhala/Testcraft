"use client"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { LogOut, User } from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import type { UserProfile } from "@/lib/database/types"

interface DashboardHeaderProps {
  user: SupabaseUser
  profile: UserProfile | null
}

export function DashboardHeader({ user, profile }: DashboardHeaderProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push("/")}
              className="group flex items-center space-x-2 hover:scale-105 transition-all duration-300 ease-out"
            >
              <h1 className="text-xl font-bold">
                <span className="relative">
                  <span className="text-slate-800 dark:text-slate-200">Test</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-slate-800 dark:bg-slate-200 group-hover:w-full transition-all duration-300"></span>
                </span>
                <span className="relative">
                  <span className="text-emerald-800 dark:text-emerald-300">craft</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-800 dark:bg-emerald-300 group-hover:w-full transition-all duration-300 delay-100"></span>
                </span>
                <span className="text-slate-500 dark:text-slate-400">.in</span>
              </h1>
            </button>
            <span className="text-muted-foreground">Dashboard</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">{profile?.full_name || user.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
