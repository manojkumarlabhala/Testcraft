// Utility to get super admin emails from env
export function getSuperAdminEmails(): string[] {
  const envEmails = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAILS || ""
  return envEmails.split(",").map(e => e.trim()).filter(Boolean)
}

// Check if an email is a super admin
export function isSuperAdmin(email: string | undefined): boolean {
  if (!email) return false
  const superAdminEmails = getSuperAdminEmails()
  return superAdminEmails.includes(email)
}
