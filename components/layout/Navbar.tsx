// components/layout/Navbar.tsx
"use client"

import Link          from "next/link"
import { useAuth }   from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  async function handleLogout() {
    await logout()
    router.push("/")
  }

  return (
    <nav className="bg-gray-950 border-b border-gray-800 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="text-orange-500 font-bold text-xl tracking-tight">
          MotorShop
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-6">
          <Link
            href="/products"
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            Products
          </Link>

          {/* Show admin link only for admins */}
          {user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="text-orange-400 hover:text-orange-300 text-sm transition-colors"
            >
              Admin
            </Link>
          )}

          {/* Auth buttons — change based on login state */}
          {loading ? (
            // Don't flash login/logout while checking auth
            <div className="w-20 h-8 bg-gray-800 rounded-lg animate-pulse" />
          ) : user ? (
            // Logged in state
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            // Logged out state
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  )
}