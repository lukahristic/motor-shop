// components/admin/EditProductForm.tsx
// Client component — handles form state and PUT request
// Receives existing product data as a prop (pre-filled)

"use client"

import { useState }  from "react"
import { useRouter } from "next/navigation"
import Link          from "next/link"
import ImageUpload from "@/components/ui/ImageUpload"

// We use Prisma's generated type here for full accuracy
import { SerializedProduct } from "@/types"

interface Props {
  product: SerializedProduct  // ← plain object, safe for client
}

export default function EditProductForm({ product }: Props) {
  const router = useRouter()

  // Pre-fill form with existing product values
  const [form, setForm] = useState({
    name:        product.name,
    description: product.description ?? "",
    price:       String(product.price),
    salePrice:   product.salePrice ? String(product.salePrice) : "",  // ← new
    stockCount:  product.stockCount ? String(product.stockCount) : "", // ← new
    isNew:       product.isNew,                                        // ← new
    category:    product.category,
    subcategory: product.subcategory ?? "",
    brand:       product.brand ?? "",
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
          salePrice:  form.salePrice ? parseFloat(form.salePrice) : null,
          stockCount: form.stockCount ? parseInt(form.stockCount) : null,
          isNew:      form.isNew,
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
          {/* Sale Price */}
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">
              Sale Price
              <span className="text-gray-600 text-xs ml-2">
                (leave empty for no discount)
              </span>
            </label>
            <input
              name="salePrice"
              type="number"
              step="0.01"
              min="0"
              value={form.salePrice}
              onChange={handleChange}
              placeholder="e.g. 520.00"
              className="w-full bg-gray-800 border border-gray-700 text-white
                        rounded-lg px-4 py-2.5 text-sm focus:outline-none
                        focus:border-orange-500 transition-colors"
            />
            {/* Live discount preview */}
            {form.price && form.salePrice &&
            Number(form.salePrice) < Number(form.price) && (
              <p className="text-green-400 text-xs mt-1.5">
                ✓ {Math.round(
                    ((Number(form.price) - Number(form.salePrice)) /
                      Number(form.price)) * 100
                  )}% discount —
                saves ₱{(Number(form.price) - Number(form.salePrice)).toFixed(2)}
              </p>
            )}
          </div>

          {/* Stock Count */}
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">
              Stock Count
              <span className="text-gray-600 text-xs ml-2">
                (leave empty for unlimited)
              </span>
            </label>
            <input
              name="stockCount"
              type="number"
              min="0"
              value={form.stockCount}
              onChange={handleChange}
              placeholder="e.g. 25"
              className="w-full bg-gray-800 border border-gray-700 text-white
                        rounded-lg px-4 py-2.5 text-sm focus:outline-none
                        focus:border-orange-500 transition-colors"
            />
          </div>

          {/* Is New toggle */}
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
              <span className="text-gray-600 text-xs ml-2">
                (shows "New arrival" badge on card)
              </span>
            </label>
          </div>
          {/* Category */}
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
              <option value="Big Bike">Big Bike</option>
              <option value="Scooter">Scooter</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>

          {/* Subcategory */}
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">
              Part Type
            </label>
            <select
              name="subcategory"
              value={form.subcategory}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors"
            >
              <option value="">Select part type</option>
              <option value="Engine">Engine parts</option>
              <option value="Brakes">Brakes</option>
              <option value="Suspension">Suspension</option>
              <option value="Exhaust">Exhaust</option>
              <option value="Electrical">Electrical</option>
              <option value="Body">Body & fairings</option>
              <option value="Drivetrain">Drivetrain</option>
              <option value="Oils">Oils & fluids</option>
            </select>
          </div>

          {/* Brand */}
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">
              Brand
            </label>
            <select
              name="brand"
              value={form.brand}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors"
            >
              <option value="">Select brand</option>
              <option value="Kawasaki">Kawasaki</option>
              <option value="BMW">BMW</option>
              <option value="Honda">Honda</option>
              <option value="Suzuki">Suzuki</option>
              <option value="Yamaha">Yamaha</option>
              <option value="Ducati">Ducati</option>
              <option value="KTM">KTM</option>
              <option value="Triumph">Triumph</option>
              <option value="Universal">Universal (fits all)</option>
            </select>
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-gray-400 text-sm mb-1.5">
            Image URL
          </label>
            {/* Image Upload */}
          <ImageUpload
            currentImageUrl={form.imageUrl || null}
            onUploadComplete={(url) => {
              setForm((prev) => ({ ...prev, imageUrl: url }))
            }}
            onClear={() => {
              setForm((prev) => ({ ...prev, imageUrl: "" }))
            }}
          />

          {form.imageUrl && (
            <p className="text-gray-600 text-xs mt-1 truncate">
              ✓ {form.imageUrl}
            </p>
          )}
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