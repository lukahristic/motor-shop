// app/big-bikes/page.tsx
// The dedicated Big Bike Parts landing section
// Fetches products filtered to category "Big Bike"

import Link          from "next/link"
import Image         from "next/image"
import { prisma }    from "@/lib/prisma"
import AddToCartButton from "@/components/ui/AddToCartButton"
import { imageSrc } from "@/lib/image-src"

export const dynamic = "force-dynamic"

// Part type subcategories for the grid
const PART_TYPES = [
  { name: "Engine parts",    value: "Engine",     icon: "⚙️" },
  { name: "Brakes",          value: "Brakes",     icon: "🛞" },
  { name: "Suspension",      value: "Suspension", icon: "🔩" },
  { name: "Exhaust",         value: "Exhaust",    icon: "💨" },
  { name: "Electrical",      value: "Electrical", icon: "⚡" },
  { name: "Body & fairings", value: "Body",       icon: "🏁" },
  { name: "Drivetrain",      value: "Drivetrain", icon: "⛓️" },
  { name: "Oils & fluids",   value: "Oils",       icon: "🛢️" },
]

const BRANDS = [
  "All brands",
  "Kawasaki", "BMW", "Honda",
  "Suzuki", "Ducati", "KTM",
  "Yamaha", "Triumph",
]

interface PageProps {
  searchParams: Promise<{
    brand?:       string
    subcategory?: string
  }>
}

async function getProducts(brand?: string, subcategory?: string) {
  return prisma.product.findMany({
    where: {
      category:    "Big Bike",
      ...(brand        && brand !== "All brands" ? { brand }       : {}),
      ...(subcategory  ? { subcategory } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 12,
  })
}

async function getSubcategoryCounts() {
  const counts = await prisma.product.groupBy({
    by: ["subcategory"],
    where: { category: "Big Bike" },
    _count: { id: true },
  })

  return Object.fromEntries(
    counts.map((c) => [c.subcategory, c._count.id])
  )
}

export default async function BigBikesPage({ searchParams }: PageProps) {
  const params      = await searchParams
  const brand       = params.brand
  const subcategory = params.subcategory

  const [products, counts] = await Promise.all([
    getProducts(brand, subcategory),
    getSubcategoryCounts(),
  ])

  const totalProducts = await prisma.product.count({
    where: { category: "Big Bike" },
  })

  return (
    <div className="bg-gray-950 min-h-screen">

      {/* ── Hero Banner ─────────────────────────────────── */}
      <section className="relative overflow-hidden">

        {/* Dark background with orange accent */}
        <div className="absolute inset-0 bg-gray-950" />
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500" />

        {/* Decorative large bike silhouette */}
        <div className="absolute right-0 top-0 bottom-0 flex items-center justify-end pr-16 opacity-5 select-none pointer-events-none">
          <span className="text-[240px]">🏍️</span>
        </div>

        {/* Overlay fade */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/95 to-transparent" />

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-0.5 bg-orange-500" />
            <span className="text-orange-500 text-xs font-bold tracking-[2px] uppercase">
              Big Bike Parts
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight mb-4">
            Built for the{" "}
            <span className="text-orange-500">road ahead</span>
          </h1>

          <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
            Premium parts for sport bikes, nakeds, and adventure tourers.
            Kawasaki, BMW, Honda, Suzuki, Ducati — sourced from authorized
            distributors across the Philippines.
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-3 flex-wrap mb-10">
            <Link
              href="/products?category=Big+Bike"
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg text-sm transition-colors"
            >
              Shop all big bike parts
            </Link>
            <Link
              href="/?ymm=true"
              className="px-6 py-3 bg-transparent hover:bg-gray-800 text-white border border-gray-700 hover:border-orange-500 hover:text-orange-400 font-medium rounded-lg text-sm transition-colors"
            >
              Find by my bike
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 flex-wrap">
            <div>
              <p className="text-white text-xl font-extrabold">
                {totalProducts.toLocaleString()}+
              </p>
              <p className="text-gray-500 text-xs uppercase tracking-wide mt-0.5">
                Big bike parts
              </p>
            </div>
            <div className="w-px h-8 bg-gray-800" />
            <div>
              <p className="text-white text-xl font-extrabold">12</p>
              <p className="text-gray-500 text-xs uppercase tracking-wide mt-0.5">
                Brands stocked
              </p>
            </div>
            <div className="w-px h-8 bg-gray-800" />
            <div>
              <p className="text-white text-xl font-extrabold">48hr</p>
              <p className="text-gray-500 text-xs uppercase tracking-wide mt-0.5">
                Metro delivery
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Brand Filter Row ─────────────────────────────── */}
      <div className="bg-gray-900 border-y border-gray-800 px-4 sm:px-6 py-4 overflow-x-auto">
        <p className="text-gray-600 text-xs font-medium uppercase tracking-widest mb-3">
          Filter by brand
        </p>
        <div className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap">
          {BRANDS.map((b) => {
            const isActive = b === "All brands"
              ? !brand || brand === "All brands"
              : brand === b

            return (
              <Link
                key={b}
                href={`/big-bikes?brand=${encodeURIComponent(b)}${subcategory ? `&subcategory=${subcategory}` : ""}`}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide border transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-orange-500/10 border-orange-500 text-orange-400"
                    : "bg-gray-800 border-gray-700 text-gray-400 hover:border-orange-500 hover:text-orange-400"
                }`}
              >
                {b}
              </Link>
            )
          })}
        </div>
      </div>

      {/* ── Part Type Grid ───────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-white font-bold text-lg mb-5">
          Shop by part type
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-2">
          {PART_TYPES.map((pt) => {
            const count   = counts[pt.value] ?? 0
            const isActive = subcategory === pt.value

            return (
              <Link
                key={pt.value}
                href={`/big-bikes?${brand ? `brand=${encodeURIComponent(brand)}&` : ""}subcategory=${pt.value}`}
                className={`flex flex-col items-center text-center p-4 rounded-xl border transition-all ${
                  isActive
                    ? "bg-orange-500/10 border-orange-500"
                    : "bg-gray-900 border-gray-800 hover:border-orange-500 hover:bg-orange-500/5"
                }`}
              >
                <span className="text-2xl mb-2">{pt.icon}</span>
                <span className={`text-xs font-semibold mb-1 ${
                  isActive ? "text-orange-400" : "text-gray-300"
                }`}>
                  {pt.name}
                </span>
                <span className="text-gray-600 text-xs">{count} items</span>
              </Link>
            )
          })}
        </div>

        {/* Clear filters link */}
        {(brand || subcategory) && (
          <div className="mt-3 mb-6">
            <Link
              href="/big-bikes"
              className="text-orange-400 hover:text-orange-300 text-xs transition-colors"
            >
              ← Clear all filters
            </Link>
          </div>
        )}
      </div>

      {/* ── Product Grid ─────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-white font-bold text-lg">
            {subcategory ? `${subcategory} parts` : "Top sellers"}
            {brand && brand !== "All brands" && ` — ${brand}`}
          </h2>
          <span className="text-gray-500 text-sm">
            {products.length} products
          </span>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-gray-900 border border-gray-800 rounded-xl">
            <p className="text-gray-500 text-lg mb-2">
              No products found for this filter
            </p>
            <Link
              href="/big-bikes"
              className="text-orange-400 hover:text-orange-300 text-sm transition-colors"
            >
              Browse all big bike parts
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-gray-900 border border-gray-800 hover:border-orange-500 rounded-xl overflow-hidden transition-all group hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-44 bg-gray-800">
                  <Image
                    src={imageSrc(product.imageUrl)}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  {/* Brand badge */}
                  {product.brand && (
                    <span className="absolute top-3 left-3 bg-black/70 text-gray-300 text-xs font-semibold px-2 py-1 rounded-md">
                      {product.brand}
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="p-4">
                  {product.subcategory && (
                    <p className="text-orange-500 text-xs font-bold uppercase tracking-wide mb-1">
                      {product.subcategory}
                    </p>
                  )}

                  <Link href={`/products/${product.slug}`}>
                    <h3 className="text-white text-sm font-semibold leading-snug mb-3 group-hover:text-orange-400 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>

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
        )}

        {/* View all link */}
        {products.length > 0 && (
          <div className="text-center mt-10">
            <Link
              href="/products?category=Big+Bike"
              className="inline-flex items-center gap-2 px-8 py-3 border border-gray-700 hover:border-orange-500 text-gray-400 hover:text-orange-400 rounded-lg text-sm font-medium transition-colors"
            >
              View all big bike parts
              <span>→</span>
            </Link>
          </div>
        )}
      </div>

      {/* ── Bottom CTA Strip ─────────────────────────────── */}
      <div className="bg-orange-500 px-4 sm:px-6 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-white font-bold text-base">
              Can't find the part you need?
            </p>
            <p className="text-orange-100 text-sm mt-0.5">
              Our expert team sources hard-to-find parts. Message us on
              Facebook or Viber.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-6 py-3 bg-white text-orange-500 font-bold rounded-lg text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Contact our team
          </Link>
        </div>
      </div>

    </div>
  )
}