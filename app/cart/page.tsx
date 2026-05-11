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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

        {/* Cart items — full width on mobile */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.productId}
              className="bg-gray-900 border border-gray-800 rounded-xl p-3 sm:p-4 flex gap-3 sm:gap-4"
            >
              {/* Smaller image on mobile */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden shrink-0">
                <Image
                  src={item.imageUrl ?? FALLBACK_IMAGE}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.slug}`}
                  className="text-white text-sm font-medium hover:text-orange-400 transition-colors line-clamp-2"
                >
                  {item.name}
                </Link>
                <p className="text-orange-400 font-semibold mt-1 text-sm">
                  ${item.price.toFixed(2)}
                </p>

                {/* Quantity + remove row */}
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="w-7 h-7 bg-gray-800 hover:bg-gray-700 text-white rounded-md flex items-center justify-center text-sm transition-colors"
                  >−</button>
                  <span className="text-white text-sm w-4 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="w-7 h-7 bg-gray-800 hover:bg-gray-700 text-white rounded-md flex items-center justify-center text-sm transition-colors"
                  >+</button>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="ml-1 text-gray-600 hover:text-red-400 text-xs transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* Line total — hidden on very small, shown sm+ */}
              <div className="hidden sm:block text-white font-bold text-right shrink-0">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Order summary — full width on mobile, sticky on desktop */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 lg:sticky lg:top-6">
            {/* ... rest of summary unchanged */}
          </div>
        </div>
      </div>  
    </div>
  )
}