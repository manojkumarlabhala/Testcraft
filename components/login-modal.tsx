"use client"
"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogIn, UserPlus } from "lucide-react"

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center bg-gradient-to-r from-slate-800 via-emerald-800 to-slate-700 dark:from-slate-200 dark:via-emerald-300 dark:to-slate-300 bg-clip-text text-transparent">
            Welcome to Testcraft.in
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            Sign in to access premium features, track your progress, and save your favorite papers.
          </p>
          <div className="space-y-3">
            <Button asChild className="w-full" onClick={() => onOpenChange(false)}>
              <Link href="/auth/login">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full bg-transparent" onClick={() => onOpenChange(false)}>
              <Link href="/auth/signup">
                <UserPlus className="h-4 w-4 mr-2" />
                Create Account
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
