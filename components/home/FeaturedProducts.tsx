// components/home/FeaturedProducts.tsx
// Shows the newest in-stock products as "hot deals"
// Server component — fetches from DB directly

import Link             from "next/link"
import Image            from "next/image"
import { prisma }       from "@/lib/prisma"
import { FALLBACK_IMAGE } from "@/lib/constants"
import AddToCartButton  from "@/components/ui/AddToCartButton"

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
            <div
              key={product.id}
              className="bg-gray-900 border border-gray-800 hover:border-orange-500
                         rounded-xl overflow-hidden transition-all duration-300
                         group hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative h-44 bg-gray-800">
                <Image
                  src={product.imageUrl ?? FALLBACK_IMAGE}
                  alt={product.name}
                  fill
                  className="object-cover"
                />

                {/* Category badge */}
                <span className="absolute top-3 left-3 bg-black/70
                                 text-orange-400 text-xs font-bold
                                 px-2 py-1 rounded-md uppercase tracking-wide">
                  {product.category}
                </span>
              </div>

              {/* Body */}
              <div className="p-4">
                <Link href={`/products/${product.slug}`}>
                  <h3 className="text-white text-sm font-semibold leading-snug
                                 mb-3 group-hover:text-orange-400 transition-colors
                                 line-clamp-2 min-h-[40px]">
                    {product.name}
                  </h3>
                </Link>

                {/* Price */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-orange-400 text-lg font-extrabold">
                    ₱{Number(product.price).toLocaleString()}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    product.inStock
                      ? "bg-green-900/50 text-green-400"
                      : "bg-red-900/50 text-red-400"
                  }`}>
                    {product.inStock ? "In stock" : "Out of stock"}
                  </span>
                </div>

                <AddToCartButton
                  inStock={product.inStock}
                  product={{
                    productId: product.id,
                    name:      product.name,
                    price:     Number(product.price),
                    imageUrl:  product.imageUrl,
                    slug:      product.slug,
                  }}
                />
              </div>
            </div>
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