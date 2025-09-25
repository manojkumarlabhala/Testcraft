import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server-client"
import { isSuperAdmin } from "@/lib/admin/super-admin-emails"

export async function GET() {
  const supabase = createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !isSuperAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, is_active, created_at")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ users: [] }, { status: 500 })
  }

  return NextResponse.json({ users: data || [] })
}
