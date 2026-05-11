// components/ui/AddToCartButton.tsx
"use client"

import { useState }  from "react"
import { useCart }   from "@/lib/cart-context"
import { CartItem }  from "@/types"

interface Props {
  product: Omit<CartItem, "quantity">
  inStock: boolean
}

export default function AddToCartButton({ product, inStock }: Props) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addToCart(product)
    setAdded(true)
    // Reset button text after 2 seconds
    setTimeout(() => setAdded(false), 2000)
  }

  if (!inStock) {
    return (
      <button
        disabled
        className="w-full py-3 px-6 rounded-lg font-semibold text-white bg-gray-700 opacity-50 cursor-not-allowed"
      >
        Out of Stock
      </button>
    )
  }

  return (
    <button
      onClick={handleAdd}
      className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all ${
        added
          ? "bg-green-600 scale-95"
          : "bg-orange-500 hover:bg-orange-600"
      }`}
    >
      {added ? "✓ Added to Cart" : "Add to Cart"}
    </button>
  )
}