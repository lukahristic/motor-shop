// app/order-success/page.tsx
// Stripe redirects here after successful payment

"use client"

import { useEffect }  from "react"
import { useCart }    from "@/lib/cart-context"
import Link           from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId      = searchParams.get("orderId")
  const { clearCart } = useCart()

  // Clear the cart after successful payment
  useEffect(() => {
    clearCart()
  }, [])

  return (
    <div className="max-w-lg mx-auto px-6 py-24 text-center">
      <div className="w-16 h-16 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-3xl">✓</span>
      </div>

      <h1 className="text-3xl font-bold text-white mb-4">
        Order Confirmed!
      </h1>

      <p className="text-gray-400 mb-2">
        Thank you for your purchase.
      </p>

      {orderId && (
        <p className="text-gray-500 text-sm mb-8">
          Order #{orderId}
        </p>
      )}

      <div className="flex flex-col gap-3 items-center">
        <Link
          href="/products"
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
        >
          Continue Shopping
        </Link>
        <Link
          href="/orders"
          className="text-gray-400 hover:text-white text-sm transition-colors"
        >
          View my orders
        </Link>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}