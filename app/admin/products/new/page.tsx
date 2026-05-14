// app/admin/products/new/page.tsx
"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link          from "next/link"
import { getPriceInfo, formatPHP } from "@/lib/price"
import ImageUpload from "@/components/ui/ImageUpload"

export default function NewProductPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    name:        "",
    description: "",
    price:       "",
    salePrice:   "",
    stockCount:  "",
    isNew:       false,
    category:    "",
    subcategory: "",
    brand:       "",
    imageUrl:    "",   
    inStock:     true,
  })

  const [error,   setError]   = useState("")
  const [loading, setLoading] = useState(false)

  const pricePreview = useMemo(() => {
    const price = parseFloat(form.price)
    const sale  = form.salePrice.trim() === "" ? null : parseFloat(form.salePrice)
    if (!Number.isFinite(price) || price <= 0) return null
    if (sale === null || !Number.isFinite(sale)) return null
    return getPriceInfo(price, sale)
  }, [form.price, form.salePrice])

  // Update a single field in the form state
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/products", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          salePrice:  form.salePrice ? parseFloat(form.salePrice) : null,
          stockCount: form.stockCount ? parseInt(form.stockCount) : null,
          isNew:      form.isNew,
        }),
      })

      const json = await res.json()

      if (!res.ok) throw new Error(json.error || "Failed to create product")

      // Go back to products list
      router.push("/admin/products")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/products"
          className="text-gray-500 hover:text-white text-sm transition-colors"
        >
          ← Products
        </Link>
        <h1 className="text-2xl font-bold text-white">Add New Product</h1>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-2xl">

        {error && (
          <div className="mb-6 px-4 py-3 bg-red-900/40 border border-red-700 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">
              Product Name *
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Premium Oil Filter"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe the product..."
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors resize-none"
            />
          </div>

          {/* Price + Category row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">
                Price *
              </label>
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={handleChange}
                required
                placeholder="29.99"
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">
                Category *
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors"
              >
                <option value="">Select category</option>
                <option value="Engine">Engine</option>
                <option value="Brakes">Brakes</option>
                <option value="Suspension">Suspension</option>
                <option value="Electrical">Electrical</option>
                <option value="Body">Body</option>
              </select>
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">
              Image URL
            </label>
            {/* Image Upload — replaces the plain text URL input */}
              <ImageUpload
                currentImageUrl={form.imageUrl || null}
                onUploadComplete={(url) => {
                  setForm((prev) => ({ ...prev, imageUrl: url }))
                }}
                onClear={() => {
                  setForm((prev) => ({ ...prev, imageUrl: "" }))
                }}
              />

              {/* Show the URL as read-only confirmation after upload */}
              {form.imageUrl && (
                <p className="text-gray-600 text-xs mt-1 truncate">
                  ✓ {form.imageUrl}
                </p>
              )}
          </div>

          {/* Sale price + live discount preview */}
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">
              Sale price (optional)
            </label>
            <input
              name="salePrice"
              type="number"
              step="0.01"
              min="0"
              value={form.salePrice}
              onChange={handleChange}
              placeholder="Leave empty if not on sale"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors"
            />
            {pricePreview?.isOnSale && (
              <p className="mt-2 text-xs text-green-400 font-semibold">
                Live preview: −{pricePreview.discountPercent}% off — customer saves{" "}
                {formatPHP(pricePreview.discountAmount)} (sale {formatPHP(pricePreview.displayPrice)} vs{" "}
                {formatPHP(pricePreview.originalPrice)})
              </p>
            )}
            {pricePreview && !pricePreview.isOnSale && form.salePrice.trim() !== "" && (
              <p className="mt-2 text-xs text-amber-400">
                Sale price must be lower than regular price to show as a discount.
              </p>
            )}
          </div>

          {/* Stock count */}
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">
              Stock count (optional)
            </label>
            <input
              name="stockCount"
              type="number"
              min="0"
              step="1"
              value={form.stockCount}
              onChange={handleChange}
              placeholder="Empty = unlimited"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors"
            />
            <p className="mt-1 text-xs text-gray-500">
              When set to a small number (e.g. 3), the storefront shows an &quot;Only N left&quot; badge.
            </p>
          </div>

          {/* New arrival */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isNew"
              id="isNew"
              checked={form.isNew}
              onChange={handleChange}
              className="w-4 h-4 accent-orange-500"
            />
            <label htmlFor="isNew" className="text-gray-400 text-sm">
              Mark as new arrival
            </label>
          </div>

          {/* In Stock toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="inStock"
              id="inStock"
              checked={form.inStock}
              onChange={handleChange}
              className="w-4 h-4 accent-orange-500"
            />
            <label htmlFor="inStock" className="text-gray-400 text-sm">
              In Stock
            </label>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {loading ? "Creating..." : "Create Product"}
            </button>
            <Link
              href="/admin/products"
              className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded-lg transition-colors"
            >
              Cancel
            </Link>
          </div>

        </form>
      </div>
    </div>
  )
}