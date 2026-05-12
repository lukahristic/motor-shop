// components/home/FeaturedProducts.tsx
// Shows the newest in-stock products as "hot deals"
// Server component — fetches from DB directly

import Link             from "next/link"
import { prisma }       from "@/lib/prisma"
import { FALLBACK_IMAGE } from "@/lib/constants"
import AddToCartButton  from "@/components/ui/AddToCartButton"
import ProductCard from "@/components/ui/ProductCard"


async function getFeaturedProducts() {
  return prisma.product.findMany({
    where:   { inStock: true },
    orderBy: { createdAt: "desc" },
    take:    4,
  })
}

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts()

  if (products.length === 0) return null

  return (
    <section className="bg-gray-900/50 py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-6 h-0.5 bg-orange-500" />
              <span className="text-orange-500 text-xs font-bold tracking-widest uppercase">
                Hot deals
              </span>
            </div>
            <h2 className="text-white text-2xl sm:text-3xl font-extrabold tracking-tight">
              Top sellers this week
            </h2>
          </div>
          <Link
            href="/products"
            className="text-orange-400 hover:text-orange-300 text-sm
                       font-semibold transition-colors hidden sm:block"
          >
            See all →
          </Link>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              ...product,
              price:      Number(product.price),
              salePrice:  product.salePrice ? Number(product.salePrice) : null,
              stockCount: product.stockCount ?? null,
              isNew:      product.isNew,
            }}
          />
        ))}
        </div>

        {/* Mobile see all */}
        <div className="text-center mt-8 sm:hidden">
          <Link
            href="/products"
            className="inline-block px-6 py-3 border border-gray-700
                       hover:border-orange-500 text-gray-400 hover:text-orange-400
                       rounded-lg text-sm font-medium transition-colors"
          >
            See all products →
          </Link>
        </div>
      </div>
    </section>
  )
}