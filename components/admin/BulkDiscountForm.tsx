// components/admin/BulkDiscountForm.tsx
// Lets admins apply a % discount to a whole category, brand, or all products

"use client"

import { useState }  from "react"
import { useRouter } from "next/navigation"

interface Props {
  categories: string[]
  brands:     string[]
}

type DiscountType = "all" | "category" | "brand"

export default function BulkDiscountForm({ categories, brands }: Props) {
  const router = useRouter()

  const [type,    setType]    = useState<DiscountType>("category")
  const [value,   setValue]   = useState("")
  const [percent, setPercent] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{
    text: string
    ok:   boolean
  } | null>(null)

  function showMessage(text: string, ok: boolean) {
    setMessage({ text, ok })
    setTimeout(() => setMessage(null), 4000)
  }

  async function handleApply() {
    if (!percent || Number(percent) < 1) return
    if (type !== "all" && !value) return

    setLoading(true)

    try {
      const res  = await fetch("/api/admin/discounts", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ type, value, percent: Number(percent) }),
      })
      const json = await res.json()

      if (!res.ok) throw new Error(json.error)

      showMessage(json.message, true)
      router.refresh()
    } catch (err) {
      showMessage(
        err instanceof Error ? err.message : "Failed to apply discount",
        false
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleClearAll() {
    const confirmed = window.confirm(
      "Clear ALL active discounts? This will remove salePrice from every product."
    )
    if (!confirmed) return

    setLoading(true)

    try {
      const res  = await fetch("/api/admin/discounts", {
        method:  "DELETE",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ type: "all" }),
      })
      const json = await res.json()

      if (!res.ok) throw new Error(json.error)

      showMessage(json.message, true)
      router.refresh()
    } catch (err) {
      showMessage(
        err instanceof Error ? err.message : "Failed to clear discounts",
        false
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
      <h2 className="text-white font-semibold text-lg mb-1">
        Bulk Discount
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        Apply a percentage discount to multiple products at once
      </p>

      {/* Feedback message */}
      {message && (
        <div className={`mb-5 px-4 py-3 rounded-lg border text-sm ${
          message.ok
            ? "bg-green-900/30 border-green-700 text-green-400"
            : "bg-red-900/30 border-red-700 text-red-400"
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">

        {/* Discount type */}
        <div>
          <label className="block text-gray-400 text-xs font-semibold
                            uppercase tracking-wide mb-2">
            Apply to
          </label>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value as DiscountType)
              setValue("")
            }}
            className="w-full bg-gray-800 border border-gray-700 text-white
                       rounded-lg px-3 py-2.5 text-sm focus:outline-none
                       focus:border-orange-500 transition-colors"
          >
            <option value="all">All products</option>
            <option value="category">By category</option>
            <option value="brand">By brand</option>
          </select>
        </div>

        {/* Category or brand selector */}
        {type !== "all" && (
          <div>
            <label className="block text-gray-400 text-xs font-semibold
                              uppercase tracking-wide mb-2">
              {type === "category" ? "Category" : "Brand"}
            </label>
            <select
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white
                         rounded-lg px-3 py-2.5 text-sm focus:outline-none
                         focus:border-orange-500 transition-colors"
            >
              <option value="">
                Select {type === "category" ? "category" : "brand"}
              </option>
              {(type === "category" ? categories : brands).map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
        )}

        {/* Percent input */}
        <div>
          <label className="block text-gray-400 text-xs font-semibold
                            uppercase tracking-wide mb-2">
            Discount %
          </label>
          <div className="relative">
            <input
              type="number"
              min="1"
              max="90"
              value={percent}
              onChange={(e) => setPercent(e.target.value)}
              placeholder="e.g. 25"
              className="w-full bg-gray-800 border border-gray-700 text-white
                         rounded-lg px-3 py-2.5 pr-8 text-sm focus:outline-none
                         focus:border-orange-500 transition-colors"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2
                             text-gray-500 text-sm">
              %
            </span>
          </div>
        </div>

      </div>

      {/* Preview */}
      {percent && Number(percent) > 0 && (
        <div className="bg-orange-500/10 border border-orange-500/30
                        rounded-lg px-4 py-3 mb-5">
          <p className="text-orange-300 text-sm font-medium">
            Preview: A product priced at ₱1,000 will show a sale price
            of ₱{(1000 - (1000 * Number(percent)) / 100).toFixed(0)}
            {" "}(saving ₱{((1000 * Number(percent)) / 100).toFixed(0)})
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={handleApply}
          disabled={
            loading ||
            !percent ||
            Number(percent) < 1 ||
            (type !== "all" && !value)
          }
          className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600
                     disabled:opacity-40 disabled:cursor-not-allowed
                     text-white text-sm font-bold rounded-lg
                     transition-colors"
        >
          {loading ? "Applying..." : "Apply discount"}
        </button>

        <button
          onClick={handleClearAll}
          disabled={loading}
          className="px-5 py-2.5 bg-transparent border border-red-800
                     hover:border-red-600 hover:bg-red-900/20
                     disabled:opacity-40 text-red-500 hover:text-red-400
                     text-sm font-semibold rounded-lg transition-colors"
        >
          Clear all discounts
        </button>
      </div>
    </div>
  )
}