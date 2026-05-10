// app/products/[slug]/page.tsx
// This page renders for ANY route matching /products/:slug

import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getProductDetailBySlug } from "@/lib/products-data"
import { FALLBACK_IMAGE } from "@/lib/constants"

// Resolve product by slug at request time (no DB required during `next build`)
export const dynamic = "force-dynamic"

// Next.js passes route params to every page component automatically
interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params

  const product = await getProductDetailBySlug(slug)

  if (!product) {
    notFound()
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">

      {/* Back Link */}
      <Link
        href="/products"
        className="text-orange-400 hover:text-orange-300 text-sm mb-8 inline-block transition-colors"
      >
        ← Back to Products
      </Link>

      {/* Product Detail Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-6">

        {/* Left — Image */}
        <div className="relative w-full h-80 rounded-xl overflow-hidden border border-gray-800">
          <Image
            src={product.imageUrl?.trim() ? product.imageUrl : FALLBACK_IMAGE}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Right — Info */}
        <div className="flex flex-col">

          {/* Category */}
          <span className="text-orange-400 text-sm font-medium uppercase tracking-wide">
            {product.category}
          </span>

          {/* Name */}
          <h1 className="text-3xl font-bold text-white mt-2 mb-4">
            {product.name}
          </h1>

          {/* Description */}
          {product.description && (
            <p className="text-gray-400 text-base leading-relaxed mb-6">
              {product.description}
            </p>
          )}

          {/* Compatible Vehicle — only shows if data exists */}
          {product.compatibleMake && (
            <p className="text-gray-500 text-sm mt-4">
                Compatible with: {product.compatibleYear} {product.compatibleMake} {product.compatibleModel}
            </p>
            )}

          {/* Price */}
          <div className="text-4xl font-bold text-white mb-4">
            ${parseFloat(String(product.price)).toFixed(2)}
          </div>

          {/* Stock Status */}
          <div className="mb-6">
            <span className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${
              product.inStock
                ? "bg-green-900 text-green-400"
                : "bg-red-900 text-red-400"
            }`}>
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {/* Add to Cart Button — not functional yet, wired up later */}
          <button
            disabled={!product.inStock}
            className={`py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
              product.inStock
                ? "bg-orange-500 hover:bg-orange-600 cursor-pointer"
                : "bg-gray-700 cursor-not-allowed opacity-50"
            }`}
          >
            {product.inStock ? "Add to Cart" : "Unavailable"}
          </button>

        </div>
      </div>

    </div>
  )
}