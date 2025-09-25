"use client"
import { SuperAdminDashboard } from "@/components/admin/super-admin-dashboard"

export default function SuperAdminDashboardPage() {
  // TODO: Replace with real user email from auth
  const userEmail = "demo-superadmin@testcraft.in"
  return <SuperAdminDashboard userEmail={userEmail} />
}
