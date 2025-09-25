import { getSuperAdminEmails } from "@/lib/admin/super-admin-emails"
import { createClient } from "@/lib/supabase/client"

export async function isSuperAdmin(userEmail: string): Promise<boolean> {
  const superAdmins = getSuperAdminEmails()
  return superAdmins.includes(userEmail)
}

export async function getUserRole(userId: string): Promise<string> {
  const supabase = createClient()
  const { data, error } = await supabase.from("profiles").select("role").eq("id", userId).single()
  if (error || !data) return "user"
  return data.role
}
