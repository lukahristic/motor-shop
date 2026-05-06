    // components/ui/ProductCard.tsx
// Displays a single product in the grid.
// Receives a Product object as a prop — TypeScript enforces the shape.
    
import Image from "next/image"
import Link from "next/link"
import { Product } from "@/types"
import { FALLBACK_IMAGE } from "@/lib/constants"


interface ProductCardProps {
  product: Product
}

function getImageSrc(imageUrl?: string | null): string {
  if (!imageUrl || imageUrl.trim() === "") return FALLBACK_IMAGE
  return imageUrl
}


export default function ProductCard({ product }: ProductCardProps) {


  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-orange-500 transition-colors group">

      {/* Product Image */}
      <div className="relative w-full h-48">
        <Image
          src={getImageSrc(product.imageUrl)}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="p-4">

        {/* Category Badge */}
        <span className="text-xs font-medium text-orange-400 uppercase tracking-wide">
          {product.category}
        </span>

        {/* Name */}
        <h3 className="text-white font-semibold mt-1 mb-2 group-hover:text-orange-400 transition-colors">
          {product.name}
        </h3>

        {/* Description */}
        {product.description && (
          <p className="text-gray-500 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Price + Stock + Button Row */}
        <div className="flex items-center justify-between mt-auto">

          {/* Price — parseFloat handles both number and string from Prisma */}
          <span className="text-white font-bold text-lg">
            ${parseFloat(String(product.price)).toFixed(2)}
          </span>

          {/* Stock Badge */}
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            product.inStock
              ? "bg-green-900 text-green-400"
              : "bg-red-900 text-red-400"
          }`}>
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        {/* View Details Link */}
        <Link
          href={`/products/${product.slug}`}
          className="mt-4 block text-center py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          View Details
        </Link>

      </div>
    </div>
  )
}