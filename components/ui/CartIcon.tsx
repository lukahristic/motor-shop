// components/ui/CartIcon.tsx
"use client"

import Link       from "next/link"
import { useCart } from "@/lib/cart-context"

export default function CartIcon() {
  const { cart } = useCart()

  return (
    <Link
      href="/cart"
      className="relative flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors"
    >
      {/* Shopping bag icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>

      {/* Item count badge */}
      {cart.itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
          {cart.itemCount > 9 ? "9+" : cart.itemCount}
        </span>
      )}
    </Link>
  )
}