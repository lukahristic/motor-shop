// components/layout/Navbar.tsx
"use client"

import Link          from "next/link"
import { useAuth }   from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import CartIcon      from "@/components/ui/CartIcon"

export default function Navbar() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  async function handleLogout() {
    await logout()
    router.push("/")
  }

  return (
    <nav className="bg-gray-950 border-b border-gray-800 px-4 lg:px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">

        {/* Logo */}
        <Link
          href="/"
          className="text-orange-500 font-bold text-xl tracking-tight shrink-0"
        >
          MotorShop
        </Link>

        {/* Desktop nav links — hidden on mobile */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/products"
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            Products
          </Link>
          {user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="text-orange-400 hover:text-orange-300 text-sm transition-colors"
            >
              Admin
            </Link>
          )}
        </div>

        {/* Right side — always visible */}
        <div className="flex items-center gap-3">

          {/* Cart icon */}
          <CartIcon />

          {/* Auth state */}
          {loading ? (
            <div className="w-16 h-8 bg-gray-800 rounded-lg animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-3">
              {/* Name — hidden on very small screens */}
              <span className="hidden sm:block text-gray-400 text-sm truncate max-w-[120px]">
                {user.name}
              </span>
              <Link
                href="/orders"
                className="hidden md:block text-gray-400 hover:text-white text-sm transition-colors"
              >
                Orders
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>

      </div>

      {/* Mobile bottom row — only shows on small screens */}
      <div className="md:hidden flex items-center gap-4 mt-3 pt-3 border-t border-gray-800">
        <Link
          href="/products"
          className="text-gray-400 hover:text-white text-sm transition-colors"
        >
          Products
        </Link>
        {user?.role === "ADMIN" && (
          <Link
            href="/admin"
            className="text-orange-400 hover:text-orange-300 text-sm transition-colors"
          >
            Admin
          </Link>
        )}
        {user && (
          <Link
            href="/orders"
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            My Orders
          </Link>
        )}
      </div>
    </nav>
  )
}