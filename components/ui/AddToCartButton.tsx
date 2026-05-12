// components/ui/AddToCartButton.tsx
"use client"

import { useState }  from "react"
import { useCart }   from "@/lib/cart-context"
import { CartItem }  from "@/types"

interface Props {
  product:  Omit<CartItem, "quantity">
  inStock:  boolean
  compact?: boolean   // ← smaller version for product cards
}

export default function AddToCartButton({ product, inStock, compact = false }: Props) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()  // prevent navigating if inside a Link
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (!inStock) {
    return compact ? (
      <button
        disabled
        className="px-3 py-1.5 bg-gray-800 text-gray-600 text-xs
                   font-semibold rounded-lg cursor-not-allowed"
      >
        Sold out
      </button>
    ) : (
      <button
        disabled
        className="w-full py-3 px-6 rounded-lg font-semibold text-white
                   bg-gray-700 opacity-50 cursor-not-allowed"
      >
        Out of Stock
      </button>
    )
  }

  if (compact) {
    return (
      <button
        onClick={handleAdd}
        className={`
          px-3 py-1.5 text-xs font-bold rounded-lg transition-all
          active:scale-95 shrink-0
          ${added
            ? "bg-green-600 text-white"
            : "bg-orange-500 hover:bg-orange-600 text-white"
          }
        `}
      >
        {added ? "✓ Added" : "Add to cart"}
      </button>
    )
  }

  return (
    <button
      onClick={handleAdd}
      className={`
        w-full py-3 px-6 rounded-lg font-semibold text-white
        transition-all active:scale-95
        ${added
          ? "bg-green-600"
          : "bg-orange-500 hover:bg-orange-600"
        }
      `}
    >
      {added ? "✓ Added to Cart" : "Add to Cart"}
    </button>
  )
}