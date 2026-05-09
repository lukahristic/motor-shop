// components/admin/EditProductForm.tsx
// Client component — handles form state and PUT request
// Receives existing product data as a prop (pre-filled)

"use client"

import { useState }  from "react"
import { useRouter } from "next/navigation"
import Link          from "next/link"

// We use Prisma's generated type here for full accuracy
import type { Product } from "@prisma/client"

interface Props {
  product: Product
}

export default function EditProductForm({ product }: Props) {
  const router = useRouter()

  // Pre-fill form with existing product values
  const [form, setForm] = useState({
    name:        product.name,
    description: product.description ?? "",
    price:       String(product.price),
    category:    product.category,
    imageUrl:    product.imageUrl ?? "",
    inStock:     product.inStock,
  })

  const [error,   setError]   = useState("")
  const [loading, setLoading] = useState(false)

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
      // PUT to the specific product's API route
      const res = await fetch(`/api/products/${product.id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          ...form,
          price: parseFloat(form.price),
        }),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to update product")

      // Go back to products list after successful update
      router.push("/admin/products")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update product")
    } finally {
      setLoading(false)
    }
  }

  return (
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
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors resize-none"
          />
        </div>

        {/* Price + Category */}
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
          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>

        {/* In Stock */}
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

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {loading ? "Saving..." : "Save Changes"}
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
  )
}