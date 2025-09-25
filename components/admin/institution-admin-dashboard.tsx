"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export function InstitutionAdminDashboard({ institutionId }: { institutionId: string }) {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchInstitutionUsers()
  }, [institutionId])

  async function fetchInstitutionUsers() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/admin/institution-users?institution_id=${institutionId}`)
      const data = await res.json()
      setUsers(data.users || [])
    } catch {
      setError("Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-12">
      <h1 className="text-2xl font-bold mb-6 text-center">Institution Admin Dashboard</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading && <div className="text-muted-foreground mb-4">Loading...</div>}
      <div className="space-y-4">
        {users.map((user: any) => (
          <div key={user.id} className="border rounded p-4 flex justify-between items-center">
            <div>
              <div className="font-semibold">{user.name}</div>
              <div className="text-xs text-muted-foreground">{user.email}</div>
              <div className="text-xs text-muted-foreground">Role: {user.role}</div>
            </div>
            <Button size="sm">Modify</Button>
          </div>
        ))}
        {users.length === 0 && !loading && <div className="text-muted-foreground text-center">No users found.</div>}
      </div>
    </div>
  )
}
