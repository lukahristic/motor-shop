// app/products/page.tsx
// This is a SERVER COMPONENT by default in Next.js App Router.
// It runs on the server — perfect for data fetching.
// No "use client" needed here.

import ProductCard from "@/components/ui/ProductCard"
import { mockProducts } from "@/lib/mock-data"

export default function ProductsPage() {
  // Right now: data comes from mock file
  // Phase 4: this line becomes a Prisma DB query instead
  const products = mockProducts

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">

      {/* Category Filter — static for now, logic comes in Phase 5 */}
      <div className="flex gap-3 mb-8 flex-wrap">
        {["All", "Engine", "Brakes", "Suspension"].map((cat) => (
          <button
            key={cat}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-800 text-gray-300 hover:bg-orange-500 hover:text-white transition-colors"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">All Products</h1>
        <p className="text-gray-400">
          {products.length} parts available
        </p>
      </div>
      
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}