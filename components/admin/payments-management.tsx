"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function PaymentManagement() {
  const [planType, setPlanType] = useState("")
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string|null>(null)

  const handleCreateOrder = async () => {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planType, amount: Number(amount) })
      })
      const data = await res.json()
      if (res.ok) {
        setResult(`Order created: ID ${data.orderId}, Amount ₹${data.amount/100}`)
      } else {
        setResult(data.error || "Failed to create order")
      }
    } catch (err) {
      setResult("Network error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border rounded p-4 mt-6">
      <h2 className="text-xl font-semibold mb-2">Create Payment Order</h2>
      <div className="mb-2">
        <input
          className="border rounded px-2 py-1 mr-2"
          placeholder="Plan Type"
          value={planType}
          onChange={e => setPlanType(e.target.value)}
        />
        <input
          className="border rounded px-2 py-1 mr-2"
          placeholder="Amount (INR)"
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
        <Button onClick={handleCreateOrder} disabled={loading || !planType || !amount}>
          {loading ? "Creating..." : "Create Order"}
        </Button>
      </div>
      {result && <div className="mt-2 text-sm text-muted-foreground">{result}</div>}
    </div>
  )
}
