"use client"
import { useRequireLogin } from "@/hooks/use-require-login"

export function RequireLoginClient() {
  useRequireLogin()
  return null
}
