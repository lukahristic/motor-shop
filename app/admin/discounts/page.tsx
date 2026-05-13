// app/admin/discounts/page.tsx
// Admin discount management — bulk discounts + individual product pricing

import { prisma }          from "@/lib/prisma"
import BulkDiscountForm    from "@/components/admin/BulkDiscountForm"
import DiscountTable       from "@/components/admin/DiscountTable"

export const dynamic = "force-dynamic"

async function getDiscountData() {
  const products = await prisma.product.findMany({
    select: {
      id:        true,
      name:      true,
      category:  true,
      brand:     true,
      price:     true,
      salePrice: true,
      inStock:   true,
    },
    orderBy: { category: "asc" },
  })

  // Serialize decimals
  const serialized = products.map((p) => ({
    ...p,
    price:     Number(p.price),
    salePrice: p.salePrice ? Number(p.salePrice) : null,
  }))

  // Get unique categories and brands for the bulk form dropdowns
  const categories = [
    ...new Set(
      products.map((p) => p.category).filter(Boolean)
    ),
  ] as string[]

  const brands = [
    ...new Set(
      products.map((p) => p.brand).filter(Boolean)
    ),
  ] as string[]

  return { products: serialized, categories, brands }
}

export default async function AdminDiscountsPage() {
  const { products, categories, brands } = await getDiscountData()

  // Stats
  const onSaleCount     = products.filter((p) => p.salePrice !== null).length
  const totalSavings    = products.reduce((sum, p) => {
    if (!p.salePrice) return sum
    return sum + (p.price - p.salePrice)
  }, 0)
  const highestDiscount = products.reduce((max, p) => {
    if (!p.salePrice) return max
    const pct = Math.round(((p.price - p.salePrice) / p.price) * 100)
    return Math.max(max, pct)
  }, 0)

  return (
    <div>

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">
          Discount Management
        </h1>
        <p className="text-gray-500 text-sm">
          Set sale prices individually or apply bulk discounts by category or brand
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
            Products on sale
          </p>
          <p className="text-white text-3xl font-bold">{onSaleCount}</p>
          <p className="text-gray-600 text-xs mt-1">
            of {products.length} total
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
            Total customer savings
          </p>
          <p className="text-orange-400 text-3xl font-bold">
            ₱{totalSavings.toLocaleString()}
          </p>
          <p className="text-gray-600 text-xs mt-1">
            across all sale products
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5
                        col-span-2 sm:col-span-1">
          <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
            Highest discount
          </p>
          <p className="text-green-400 text-3xl font-bold">
            {highestDiscount > 0 ? `${highestDiscount}%` : "—"}
          </p>
          <p className="text-gray-600 text-xs mt-1">
            {highestDiscount > 0 ? "current max discount" : "no active discounts"}
          </p>
        </div>
      </div>

      {/* Bulk discount form */}
      <BulkDiscountForm categories={categories} brands={brands} />

      {/* Individual product table */}
      <DiscountTable products={products} />

    </div>
  )
}