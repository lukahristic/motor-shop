// components/ui/CartIcon.tsx
"use client"

import Link        from "next/link"
import { useCart } from "@/lib/cart-context"

export default function CartIcon() {
  const { cart } = useCart()

  return (
    <Link
      href="/cart"
      aria-label={`Cart — ${cart.itemCount} items`}
      className="relative p-2 rounded-lg text-gray-400
                 hover:text-white hover:bg-gray-800
                 transition-colors"
    >
      <i className="ti ti-shopping-bag text-xl" aria-hidden="true" />

      {cart.itemCount > 0 && (
        <span
          className="absolute top-1 right-1 bg-orange-500 text-white
                     text-[9px] font-bold rounded-full min-w-[16px]
                     h-4 flex items-center justify-center px-1
                     leading-none"
          aria-hidden="true"
        >
          {cart.itemCount > 9 ? "9+" : cart.itemCount}
        </span>
      )}
    </Link>
  )
}