// app/cart/page.tsx
"use client"

import { useCart }  from "@/lib/cart-context"
import { useAuth }  from "@/lib/auth-context"
import Link         from "next/link"
import Image        from "next/image"
import { useRouter } from "next/navigation"
import { FALLBACK_IMAGE } from "@/lib/constants"

function getImageSrc(imageUrl?: string | null): string {
  if (!imageUrl || imageUrl.trim() === "") return FALLBACK_IMAGE
  return imageUrl
}

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart()
  const { user }   = useAuth()
  const router     = useRouter()

  function handleCheckout() {
    if (!user) {
      // Redirect to login, then back to checkout
      router.push("/login?redirect=/checkout")
      return
    }
    router.push("/checkout")
  }

  if (cart.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">
          Find parts for your vehicle and add them here.
        </p>
        <Link
          href="/products"
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
        >
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.productId}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex gap-4"
            >
              {/* Product image */}
              <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                <Image
                  src={getImageSrc(item.imageUrl)}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.slug}`}
                  className="text-white font-medium hover:text-orange-400 transition-colors line-clamp-1"
                >
                  {item.name}
                </Link>
                <p className="text-orange-400 font-semibold mt-1">
                  ${item.price.toFixed(2)}
                </p>

                {/* Quantity controls */}
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity - 1)
                    }
                    className="w-7 h-7 bg-gray-800 hover:bg-gray-700 text-white rounded-md flex items-center justify-center text-sm transition-colors"
                  >
                    −
                  </button>
                  <span className="text-white text-sm w-4 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
                    className="w-7 h-7 bg-gray-800 hover:bg-gray-700 text-white rounded-md flex items-center justify-center text-sm transition-colors"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="ml-2 text-gray-600 hover:text-red-400 text-xs transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* Line total */}
              <div className="text-white font-bold text-right shrink-0">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 sticky top-6">
            <h2 className="text-white font-semibold text-lg mb-4">
              Order Summary
            </h2>

            <div className="space-y-2 mb-4">
              {cart.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between text-sm"
                >
                  <span className="text-gray-400 truncate mr-2">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="text-white shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-800 pt-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-400">Total</span>
                <span className="text-white font-bold text-xl">
                  ${cart.total.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
            >
              {user ? "Proceed to Checkout" : "Login to Checkout"}
            </button>

            <Link
              href="/products"
              className="block text-center text-gray-500 hover:text-gray-300 text-sm mt-4 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}