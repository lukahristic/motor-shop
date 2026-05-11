// components/admin/UpdateOrderStatus.tsx
"use client"

import { useState }  from "react"
import { useRouter } from "next/navigation"

interface Props {
  orderId:       number
  currentStatus: string
}

const STATUSES = [
  "PENDING",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
]

export default function UpdateOrderStatus({
  orderId,
  currentStatus,
}: Props) {
  const router              = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleChange(newStatus: string) {
    if (newStatus === currentStatus) return
    setLoading(true)

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) throw new Error("Failed to update")

      router.refresh()
    } catch {
      alert("Failed to update order status")
    } finally {
      setLoading(false)
    }
  }

  return (
    <select
      value={currentStatus}
      onChange={(e) => handleChange(e.target.value)}
      disabled={loading}
      className="bg-gray-800 border border-gray-700 text-white rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-orange-500 disabled:opacity-50 transition-colors"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  )
}