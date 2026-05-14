// app/scooters/page.tsx
// Dedicated landing page for scooter parts.
// Mirrors the Big Bikes page structure but with scooter-specific content.

import Link             from "next/link"
import Image            from "next/image"
import { prisma }       from "@/lib/prisma"
import AddToCartButton  from "@/components/ui/AddToCartButton"
import { FALLBACK_IMAGE } from "@/lib/constants"

export const dynamic = "force-dynamic"

// ── Scooter-specific part types ───────────────────────────
const PART_TYPES = [
  { name: "Engine parts",   value: "Engine",      icon: "⚙️"  },
  { name: "Brakes",         value: "Brakes",      icon: "🛞"  },
  { name: "Transmission",   value: "Transmission",icon: "⛓️"  },
  { name: "Electrical",     value: "Electrical",  icon: "⚡"  },
  { name: "Body & panels",  value: "Body",        icon: "🏠"  },
  { name: "Cooling",        value: "Cooling",     icon: "💧"  },
  { name: "Oils & fluids",  value: "Oils",        icon: "🛢️"  },
  { name: "Accessories",    value: "Accessories", icon: "🔧"  },
]

// ── Philippine popular scooter brands ─────────────────────
const BRANDS = [
  "All brands",
  "Honda",
  "Yamaha",
  "Suzuki",
  "Kawasaki",
  "Kymco",
  "SYM",
  "TVS",
  "Rusi",
]

// ── Popular PH scooter models for display ─────────────────
const POPULAR_MODELS = [
  { brand: "Honda",  model: "Click 125i",  emoji: "🛵" },
  { brand: "Honda",  model: "Beat",        emoji: "🛵" },
  { brand: "Honda",  model: "ADV 160",     emoji: "🛵" },
  { brand: "Yamaha", model: "NMAX 155",    emoji: "🛵" },
  { brand: "Yamaha", model: "Aerox 155",   emoji: "🛵" },
  { brand: "Yamaha", model: "Mio Gravis",  emoji: "🛵" },
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
      category: "Scooter",
      ...(brand && brand !== "All brands" ? { brand }       : {}),
      ...(subcategory                     ? { subcategory } : {}),
    },
    orderBy: { createdAt: "desc" },
    take:    12,
  })
}

async function getSubcategoryCounts() {
  const counts = await prisma.product.groupBy({
    by:    ["subcategory"],
    where: { category: "Scooter" },
    _count: { id: true },
  })

  return Object.fromEntries(
    counts.map((c) => [c.subcategory, c._count.id])
  )
}

export default async function ScootersPage({ searchParams }: PageProps) {
  const params      = await searchParams
  const brand       = params.brand
  const subcategory = params.subcategory

  const [products, counts] = await Promise.all([
    getProducts(brand, subcategory),
    getSubcategoryCounts(),
  ])

  const totalProducts = await prisma.product.count({
    where: { category: "Scooter" },
  })

  return (
    <div className="bg-gray-950 min-h-screen">

      {/* ── Hero Banner ─────────────────────────────────── */}
      <section className="relative overflow-hidden">

        {/* Background */}
        <div className="absolute inset-0 bg-gray-950" />

        {/* Left accent line — blue for scooters */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />

        {/* Decorative scooter silhouette */}
        <div
          className="absolute right-0 top-0 bottom-0 flex items-center
                     justify-end pr-16 opacity-5 select-none
                     pointer-events-none"
          aria-hidden="true"
        >
          <span className="text-[240px]">🛵</span>
        </div>

        {/* Gradient fade */}
        <div className="absolute inset-0 bg-gradient-to-r
                        from-gray-950 via-gray-950/95 to-transparent" />

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto
                        px-4 sm:px-6 py-16 sm:py-24">

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-0.5 bg-blue-500" />
            <span className="text-blue-400 text-xs font-bold
                             tracking-[2px] uppercase">
              Scooter Parts
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white
                         leading-tight tracking-tight mb-4">
            Keep your scooter{" "}
            <span className="text-blue-400">running smooth</span>
          </h1>

          <p className="text-gray-400 text-base sm:text-lg leading-relaxed
                        mb-8 max-w-xl">
            Genuine parts for Honda Click, Yamaha NMAX, Aerox, Mio, Beat,
            ADV and all popular Philippine scooters. Fast delivery nationwide.
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-3 flex-wrap mb-10">
            <Link
              href="/products?category=Scooter"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700
                         text-white font-bold rounded-lg text-sm
                         transition-colors"
            >
              Shop all scooter parts
            </Link>
            <Link
              href="/?ymm=true"
              className="px-6 py-3 bg-transparent hover:bg-gray-800
                         text-white border border-gray-700
                         hover:border-blue-500 hover:text-blue-400
                         font-medium rounded-lg text-sm transition-colors"
            >
              Find by my scooter
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 flex-wrap">
            <div>
              <p className="text-white text-xl font-extrabold">
                {totalProducts.toLocaleString()}+
              </p>
              <p className="text-gray-500 text-xs uppercase tracking-wide mt-0.5">
                Scooter parts
              </p>
            </div>
            <div className="w-px h-8 bg-gray-800" />
            <div>
              <p className="text-white text-xl font-extrabold">8</p>
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
            <div className="w-px h-8 bg-gray-800" />
            <div>
              <p className="text-white text-xl font-extrabold">100%</p>
              <p className="text-gray-500 text-xs uppercase tracking-wide mt-0.5">
                Genuine parts
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Popular Models Strip ─────────────────────────── */}
      <div className="bg-gray-900 border-y border-gray-800
                      px-4 sm:px-6 py-5">
        <div className="max-w-6xl mx-auto">
          <p className="text-gray-600 text-xs font-semibold uppercase
                        tracking-widest mb-4">
            Popular models we stock parts for
          </p>
          <div className="flex gap-3 overflow-x-auto pb-1
                          sm:pb-0 sm:flex-wrap">
            {POPULAR_MODELS.map((m) => (
              <Link
                key={`${m.brand}-${m.model}`}
                href={`/products?category=Scooter&brand=${
                  encodeURIComponent(m.brand)
                }`}
                className="flex items-center gap-2 bg-gray-800
                           hover:bg-blue-500/10 border border-gray-700
                           hover:border-blue-500 rounded-xl px-4 py-2.5
                           transition-colors shrink-0 group"
              >
                <span className="text-lg">{m.emoji}</span>
                <div>
                  <p className="text-white text-xs font-semibold
                                group-hover:text-blue-400
                                transition-colors whitespace-nowrap">
                    {m.brand} {m.model}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Brand Filter Row ─────────────────────────────── */}
      <div className="bg-gray-900/50 border-b border-gray-800
                      px-4 sm:px-6 py-4 overflow-x-auto">
        <p className="text-gray-600 text-xs font-medium uppercase
                      tracking-widest mb-3">
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
                href={`/scooters?brand=${encodeURIComponent(b)}${
                  subcategory ? `&subcategory=${subcategory}` : ""
                }`}
                className={`px-4 py-2 rounded-lg text-xs font-bold
                            uppercase tracking-wide border transition-colors
                            whitespace-nowrap ${
                              isActive
                                ? "bg-blue-500/10 border-blue-500 text-blue-400"
                                : "bg-gray-800 border-gray-700 text-gray-400 hover:border-blue-500 hover:text-blue-400"
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
            const count    = counts[pt.value] ?? 0
            const isActive = subcategory === pt.value

            return (
              <Link
                key={pt.value}
                href={`/scooters?${
                  brand ? `brand=${encodeURIComponent(brand)}&` : ""
                }subcategory=${pt.value}`}
                className={`flex flex-col items-center text-center
                            p-4 rounded-xl border transition-all ${
                              isActive
                                ? "bg-blue-500/10 border-blue-500"
                                : "bg-gray-900 border-gray-800 hover:border-blue-500 hover:bg-blue-500/5"
                            }`}
              >
                <span className="text-2xl mb-2">{pt.icon}</span>
                <span className={`text-xs font-semibold mb-1 ${
                  isActive ? "text-blue-400" : "text-gray-300"
                }`}>
                  {pt.name}
                </span>
                <span className="text-gray-600 text-xs">
                  {count} items
                </span>
              </Link>
            )
          })}
        </div>

        {/* Clear filters */}
        {(brand || subcategory) && (
          <div className="mt-3 mb-6">
            <Link
              href="/scooters"
              className="text-blue-400 hover:text-blue-300
                         text-xs transition-colors"
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
            {subcategory
              ? `${subcategory} parts`
              : "All scooter parts"
            }
            {brand && brand !== "All brands" && ` — ${brand}`}
          </h2>
          <span className="text-gray-500 text-sm">
            {products.length} products
          </span>
        </div>

        {products.length === 0 ? (
          /* ── Empty state ────────────────────────────── */
          <div className="text-center py-20 bg-gray-900 border
                          border-gray-800 rounded-xl">
            <span className="text-6xl block mb-4">🛵</span>
            <p className="text-gray-400 text-lg font-semibold mb-2">
              No scooter parts found
            </p>
            <p className="text-gray-600 text-sm mb-6">
              Try a different filter or browse all scooter parts
            </p>
            <Link
              href="/scooters"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700
                         text-white text-sm font-bold rounded-lg
                         transition-colors"
            >
              Browse all scooter parts
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2
                          lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-gray-900 border border-gray-800
                           hover:border-blue-500 rounded-xl overflow-hidden
                           transition-all duration-300 group hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-44 bg-gray-800">
                  <Image
                    src={product.imageUrl ?? FALLBACK_IMAGE}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform
                               duration-500 group-hover:scale-105"
                  />

                  {/* Sale badge */}
                  {product.salePrice &&
                   Number(product.salePrice) < Number(product.price) && (
                    <span className="absolute top-3 left-3 bg-red-600
                                     text-white text-[10px] font-bold
                                     px-2 py-0.5 rounded-md">
                      -{Math.round(
                          ((Number(product.price) - Number(product.salePrice)) /
                            Number(product.price)) * 100
                        )}% OFF
                    </span>
                  )}

                  {/* Brand badge */}
                  {product.brand && (
                    <span className="absolute bottom-3 left-3 bg-black/70
                                     text-gray-300 text-[10px] font-semibold
                                     px-2 py-0.5 rounded-md">
                      {product.brand}
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="p-4">
                  {product.subcategory && (
                    <p className="text-blue-400 text-[10px] font-bold
                                  uppercase tracking-widest mb-1.5">
                      {product.subcategory}
                    </p>
                  )}

                  <Link href={`/products/${product.slug}`}>
                    <h3 className="text-white text-sm font-semibold
                                   leading-snug mb-3 line-clamp-2
                                   group-hover:text-blue-400
                                   transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Pricing */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-white text-lg font-extrabold">
                        ₱{Number(
                            product.salePrice ?? product.price
                          ).toLocaleString()}
                      </span>
                      {product.salePrice &&
                       Number(product.salePrice) < Number(product.price) && (
                        <span className="text-gray-600 text-xs
                                         line-through ml-2">
                          ₱{Number(product.price).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] font-semibold
                                     px-2 py-1 rounded-full ${
                                       product.inStock
                                         ? "bg-green-900/50 text-green-400"
                                         : "bg-red-900/50 text-red-400"
                                     }`}>
                      {product.inStock ? "In stock" : "Out of stock"}
                    </span>
                  </div>

                  <AddToCartButton
                    inStock={product.inStock}
                    compact
                    product={{
                      productId: product.id,
                      name:      product.name,
                      price:     Number(product.salePrice ?? product.price),
                      imageUrl:  product.imageUrl,
                      slug:      product.slug,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View all */}
        {products.length > 0 && (
          <div className="text-center mt-10">
            <Link
              href="/products?category=Scooter"
              className="inline-flex items-center gap-2 px-8 py-3
                         border border-gray-700 hover:border-blue-500
                         text-gray-400 hover:text-blue-400 rounded-lg
                         text-sm font-medium transition-colors"
            >
              View all scooter parts
              <span>→</span>
            </Link>
          </div>
        )}
      </div>

      {/* ── Maintenance Tips Strip ───────────────────────── */}
      <div className="bg-gray-900 border-y border-gray-800
                      px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-white font-bold text-lg mb-6 text-center">
            Scooter maintenance checklist
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                icon:  "⚙️",
                title: "Oil change",
                text:  "Every 1,000–2,000 km for most scooters",
              },
              {
                icon:  "🛞",
                title: "Brake pads",
                text:  "Check every 5,000 km — replace when worn",
              },
              {
                icon:  "⚡",
                title: "Spark plug",
                text:  "Replace every 8,000–10,000 km",
              },
              {
                icon:  "💧",
                title: "Coolant",
                text:  "Flush and replace every 2 years",
              },
            ].map((tip) => (
              <div
                key={tip.title}
                className="bg-gray-800/50 border border-gray-700
                           rounded-xl p-4 text-center"
              >
                <span className="text-3xl block mb-3">{tip.icon}</span>
                <p className="text-white text-sm font-semibold mb-1">
                  {tip.title}
                </p>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {tip.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom CTA Strip ─────────────────────────────── */}
      <div className="bg-blue-600 px-4 sm:px-6 py-6">
        <div className="max-w-6xl mx-auto flex items-center
                        justify-between gap-4 flex-wrap">
          <div>
            <p className="text-white font-bold text-base">
              Can't find the part for your scooter?
            </p>
            <p className="text-blue-100 text-sm mt-0.5">
              Tell us your scooter model and we'll source it for you.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-6 py-3 bg-white text-blue-600 font-bold
                       rounded-lg text-sm hover:opacity-90
                       transition-opacity whitespace-nowrap"
          >
            Request a part
          </Link>
        </div>
      </div>

    </div>
  )
}