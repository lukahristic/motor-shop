// components/ui/ProductCard.tsx
// Premium product card with sale pricing, badges, wishlist,
// and hover animations.

"use client"

import Image              from "next/image"
import Link               from "next/link"
import { useState }       from "react"
import { IconHeart, IconHeartFilled } from "@tabler/icons-react"
import { getPriceInfo, formatPHP, getStockStatus } from "@/lib/price"
import { imageSrc } from "@/lib/image-src"
import AddToCartButton    from "@/components/ui/AddToCartButton"

// Accept either a raw Prisma product or a serialized one
interface ProductCardProps {
  product: {
    id:          number
    name:        string
    slug:        string
    description: string | null
    price:       number | string
    salePrice?:  number | string | null
    inStock:     boolean
    stockCount?: number | null
    isNew?:      boolean
    imageUrl:    string | null
    category:    string
    subcategory?: string | null
    brand?:       string | null
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false)

  const price     = Number(product.price)
  const salePrice = product.salePrice != null ? Number(product.salePrice) : null
  const priceInfo = getPriceInfo(price, salePrice)
  const stock     = getStockStatus(product.inStock, product.stockCount ?? null)

  return (
    <div className="group relative bg-gray-900 border border-gray-800
                    hover:border-orange-500 rounded-xl overflow-hidden
                    transition-all duration-300 hover:-translate-y-1
                    flex flex-col">

      {/* ── Image area ──────────────────────────────────── */}
      <div className="relative h-48 bg-gray-800 overflow-hidden shrink-0">

        <Image
          src={imageSrc(product.imageUrl)}
          alt={product.name}
          fill
          className={`object-cover transition-transform duration-500
                     group-hover:scale-105 ${!product.inStock ? "grayscale opacity-60" : ""}`}
        />

        {/* Dim overlay for out of stock */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/55" />
        )}

        {/* ── Badges — top left ─────────────────────────── */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">

          {/* Sale badge — highest priority */}
          {priceInfo.isOnSale && (
            <span className="bg-red-600 text-white text-[10px] font-bold
                             px-2 py-0.5 rounded-md tracking-wide">
              -{priceInfo.discountPercent}% OFF
            </span>
          )}

          {/* New arrival badge (can stack with sale) */}
          {product.isNew && (
            <span className="bg-blue-600 text-white text-[10px] font-bold
                             px-2 py-0.5 rounded-md tracking-wide">
              New arrival
            </span>
          )}

          {/* Low stock badge (shown alongside sale when applicable) */}
          {product.inStock &&
           product.stockCount != null &&
           product.stockCount <= 5 && (
            <span className="bg-amber-600 text-white text-[10px] font-bold
                             px-2 py-0.5 rounded-md tracking-wide">
              Only {product.stockCount} left
            </span>
          )}
        </div>

        {/* ── Wishlist button — top right ────────────────── */}
        <button
          onClick={(e) => {
            e.preventDefault()
            setWishlisted((v) => !v)
          }}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`
            absolute top-3 right-3 w-8 h-8 rounded-lg border
            flex items-center justify-center transition-all duration-200
            opacity-0 group-hover:opacity-100
            ${wishlisted
              ? "bg-orange-500/20 border-orange-500 text-orange-400 opacity-100"
              : "bg-black/60 border-gray-600 text-gray-400 hover:border-orange-500 hover:text-orange-400"
            }
          `}
        >
          {wishlisted ? (
            <IconHeartFilled size={18} className="shrink-0" aria-hidden />
          ) : (
            <IconHeart size={18} className="shrink-0" aria-hidden />
          )}
        </button>

        {/* Brand badge — bottom left */}
        {product.brand && (
          <span className="absolute bottom-3 left-3 bg-black/70
                           text-gray-300 text-[10px] font-semibold
                           px-2 py-0.5 rounded-md">
            {product.brand}
          </span>
        )}
      </div>

      {/* ── Card body ───────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-4">

        {/* Category + subcategory */}
        <p className="text-orange-500 text-[10px] font-bold uppercase
                      tracking-widest mb-1.5">
          {product.subcategory ?? product.category}
        </p>

        {/* Product name — links to detail page */}
        <Link href={`/products/${product.slug}`} className="flex-1">
          <h3 className="text-white text-sm font-semibold leading-snug
                         group-hover:text-orange-400 transition-colors
                         line-clamp-2 mb-3">
            {product.name}
          </h3>
        </Link>

        {/* ── Pricing ─────────────────────────────────────── */}
        <div className="mb-3">
          <div className="flex items-baseline gap-2 flex-wrap">

            {/* Sale / display price */}
            <span className={`text-lg font-extrabold ${
              priceInfo.isOnSale ? "text-orange-500" : "text-white"
            }`}>
              {formatPHP(priceInfo.displayPrice)}
            </span>

            {/* Original price — strikethrough */}
            {priceInfo.isOnSale && (
              <span className="text-gray-600 text-xs line-through">
                {formatPHP(priceInfo.originalPrice)}
              </span>
            )}
          </div>

          {/* Save amount */}
          {priceInfo.isOnSale && (
            <p className="text-green-400 text-[10px] font-bold mt-0.5">
              Save {formatPHP(priceInfo.discountAmount)}
            </p>
          )}
        </div>

        {/* ── Footer: stock badge + CTA ───────────────────── */}
        <div className="flex items-center justify-between gap-2 mt-auto">
          <span className={`text-[10px] font-semibold px-2 py-1
                           rounded-full shrink-0 ${stock.className}`}>
            {stock.label}
          </span>

          <AddToCartButton
            inStock={stock.canAdd}
            compact
            product={{
              productId: product.id,
              name:      product.name,
              price:     priceInfo.displayPrice,
              imageUrl:  product.imageUrl,
              slug:      product.slug,
            }}
          />
        </div>
      </div>
    </div>
  )
}