// components/admin/DeleteProductButton.tsx
"use client"

import { useState }    from "react"
import { useRouter }   from "next/navigation"

interface Props {
  productId:   number
  productName: string
}

export default function DeleteProductButton({ productId, productName }: Props) {
  const router              = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    // Confirm before deleting — prevents accidents
    const confirmed = window.confirm(
      `Are you sure you want to delete "${productName}"? This cannot be undone.`
    )
    if (!confirmed) return

    setLoading(true)

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Failed to delete product")

      // Refresh the page to show updated list
      router.refresh()
    } catch (err) {
      alert("Failed to delete product. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-500 hover:text-red-400 text-xs transition-colors disabled:opacity-50"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  )
}