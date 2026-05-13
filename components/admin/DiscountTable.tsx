// components/admin/DiscountTable.tsx
// Shows all products with inline editable sale prices.
// Admins can set or clear discounts per product without leaving the page.

"use client"

import { useState }  from "react"
import { useRouter } from "next/navigation"

interface DiscountProduct {
  id:        number
  name:      string
  category:  string
  brand:     string | null
  price:     number
  salePrice: number | null
  inStock:   boolean
}

interface Props {
  products: DiscountProduct[]
}

function DiscountRow({ product }: { product: DiscountProduct }) {
  const router = useRouter()

  const [salePrice, setSalePrice] = useState(
    product.salePrice ? String(product.salePrice) : ""
  )
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)
  const [error,   setError]   = useState("")

  const discountPercent = salePrice && Number(salePrice) < product.price
    ? Math.round(
        ((product.price - Number(salePrice)) / product.price) * 100
      )
    : 0

  async function handleSave() {
    setSaving(true)
    setError("")

    try {
      const res = await fetch(`/api/admin/discounts/${product.id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          salePrice: salePrice === "" ? null : Number(salePrice),
        }),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error)

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save")
    } finally {
      setSaving(false)
    }
  }

  async function handleClear() {
    setSalePrice("")
    setSaving(true)

    try {
      const res = await fetch(`/api/admin/discounts/${product.id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ salePrice: null }),
      })

      if (!res.ok) throw new Error("Failed to clear")

      router.refresh()
    } catch {
      setError("Failed to clear discount")
    } finally {
      setSaving(false)
    }
  }

  return (
    <tr className="border-b border-gray-800 last:border-0
                   hover:bg-gray-800/30 transition-colors">

      {/* Product name */}
      <td className="px-4 py-3">
        <p className="text-white text-sm font-medium line-clamp-1">
          {product.name}
        </p>
        <p className="text-gray-600 text-xs mt-0.5">
          {product.category}
          {product.brand ? ` · ${product.brand}` : ""}
        </p>
      </td>

      {/* Regular price */}
      <td className="px-4 py-3">
        <span className="text-gray-300 text-sm">
          ₱{product.price.toLocaleString()}
        </span>
      </td>

      {/* Sale price input */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2
                             text-gray-500 text-sm">
              ₱
            </span>
            <input
              type="number"
              min="1"
              value={salePrice}
              onChange={(e) => {
                setSalePrice(e.target.value)
                setError("")
              }}
              placeholder="No sale"
              className="bg-gray-800 border border-gray-700 text-white
                         rounded-lg pl-7 pr-3 py-1.5 text-sm w-28
                         focus:outline-none focus:border-orange-500
                         transition-colors"
            />
          </div>

          {/* Discount % preview */}
          {discountPercent > 0 && (
            <span className="text-green-400 text-xs font-bold
                             bg-green-900/30 px-2 py-0.5 rounded-md
                             whitespace-nowrap">
              -{discountPercent}%
            </span>
          )}
        </div>

        {error && (
          <p className="text-red-400 text-xs mt-1">{error}</p>
        )}
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        {product.salePrice ? (
          <span className="bg-orange-900/40 text-orange-400 text-xs
                           font-semibold px-2 py-1 rounded-full">
            On sale
          </span>
        ) : (
          <span className="bg-gray-800 text-gray-600 text-xs
                           font-semibold px-2 py-1 rounded-full">
            Full price
          </span>
        )}
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold
                        transition-colors disabled:opacity-50 ${
                          saved
                            ? "bg-green-600 text-white"
                            : "bg-orange-500 hover:bg-orange-600 text-white"
                        }`}
          >
            {saving ? "..." : saved ? "✓ Saved" : "Save"}
          </button>

          {/* Clear button — only show if there's a sale price */}
          {product.salePrice && (
            <button
              onClick={handleClear}
              disabled={saving}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold
                         bg-gray-800 hover:bg-gray-700 text-gray-400
                         hover:text-white transition-colors
                         disabled:opacity-50"
            >
              Clear
            </button>
          )}
        </div>
      </td>
    </tr>
  )
}

export default function DiscountTable({ products }: Props) {
  const [filter,  setFilter]  = useState("")
  const [catFilter, setCatFilter] = useState("")

  // Get unique categories for the filter
  const categories = ["All", ...new Set(products.map((p) => p.category))]

  // Filter by search and category
  const filtered = products.filter((p) => {
    const matchSearch = filter
      ? p.name.toLowerCase().includes(filter.toLowerCase()) ||
        (p.brand ?? "").toLowerCase().includes(filter.toLowerCase())
      : true

    const matchCat = catFilter && catFilter !== "All"
      ? p.category === catFilter
      : true

    return matchSearch && matchCat
  })

  const onSaleCount = products.filter((p) => p.salePrice !== null).length

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">

      {/* Table header */}
      <div className="px-5 py-4 border-b border-gray-800 flex items-center
                      justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-white font-semibold">
            Individual product discounts
          </h2>
          <p className="text-gray-500 text-sm mt-0.5">
            {onSaleCount} of {products.length} products currently on sale
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Search products..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white
                       rounded-lg px-3 py-1.5 text-sm focus:outline-none
                       focus:border-orange-500 transition-colors w-44"
          />
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white
                       rounded-lg px-3 py-1.5 text-sm focus:outline-none
                       focus:border-orange-500 transition-colors"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── DESKTOP TABLE ──────────────────────────────── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              {["Product", "Regular price", "Sale price", "Status", "Actions"]
                .map((h) => (
                  <th
                    key={h}
                    className="text-left text-gray-500 text-xs font-semibold
                               uppercase tracking-wide px-4 py-3"
                  >
                    {h}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <DiscountRow key={product.id} product={product} />
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-gray-600 text-sm"
                >
                  No products match your filter
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── MOBILE CARDS ───────────────────────────────── */}
      <div className="md:hidden divide-y divide-gray-800">
        {filtered.map((product) => (
          <MobileDiscountCard key={product.id} product={product} />
        ))}
        {filtered.length === 0 && (
          <div className="px-4 py-10 text-center text-gray-600 text-sm">
            No products match your filter
          </div>
        )}
      </div>
    </div>
  )
}

// ── Mobile card version of the discount row ──────────────
function MobileDiscountCard({ product }: { product: DiscountProduct }) {
  const router = useRouter()

  const [salePrice, setSalePrice] = useState(
    product.salePrice ? String(product.salePrice) : ""
  )
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)
  const [error,  setError]  = useState("")

  const discountPercent = salePrice && Number(salePrice) < product.price
    ? Math.round(
        ((product.price - Number(salePrice)) / product.price) * 100
      )
    : 0

  async function handleSave() {
    setSaving(true)
    setError("")
    try {
      const res = await fetch(`/api/admin/discounts/${product.id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          salePrice: salePrice === "" ? null : Number(salePrice),
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-4">
      {/* Product name + status */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="text-white text-sm font-medium line-clamp-2">
            {product.name}
          </p>
          <p className="text-gray-600 text-xs mt-0.5">
            {product.category}
            {product.brand ? ` · ${product.brand}` : ""}
          </p>
        </div>
        {product.salePrice ? (
          <span className="bg-orange-900/40 text-orange-400 text-xs
                           font-semibold px-2 py-1 rounded-full shrink-0">
            On sale
          </span>
        ) : (
          <span className="bg-gray-800 text-gray-600 text-xs
                           font-semibold px-2 py-1 rounded-full shrink-0">
            Full price
          </span>
        )}
      </div>

      {/* Prices */}
      <div className="flex items-center gap-4 mb-3">
        <div>
          <p className="text-gray-500 text-xs mb-1">Regular</p>
          <p className="text-gray-300 text-sm font-semibold">
            ₱{product.price.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-xs mb-1">Sale price</p>
          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2
                               text-gray-500 text-xs">₱</span>
              <input
                type="number"
                min="1"
                value={salePrice}
                onChange={(e) => {
                  setSalePrice(e.target.value)
                  setError("")
                }}
                placeholder="No sale"
                className="bg-gray-800 border border-gray-700 text-white
                           rounded-lg pl-7 pr-2 py-1.5 text-sm w-24
                           focus:outline-none focus:border-orange-500"
              />
            </div>
            {discountPercent > 0 && (
              <span className="text-green-400 text-xs font-bold">
                -{discountPercent}%
              </span>
            )}
          </div>
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-xs mb-2">{error}</p>
      )}

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className={`w-full py-2 rounded-lg text-sm font-bold
                    transition-colors disabled:opacity-50 ${
                      saved
                        ? "bg-green-600 text-white"
                        : "bg-orange-500 hover:bg-orange-600 text-white"
                    }`}
      >
        {saving ? "Saving..." : saved ? "✓ Saved" : "Save discount"}
      </button>
    </div>
  )
}