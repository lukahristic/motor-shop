// components/layout/Navbar.tsx
// The Navbar appears on every page via app/layout.tsx
// It is a reusable component — NOT a page

import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="bg-gray-950 border-b border-gray-800 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        {/* Logo / Brand */}
        <Link href="/" className="text-orange-500 font-bold text-xl tracking-tight">
          MotorShop
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <Link
            href="/products"
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            Products
          </Link>
          <Link
            href="/about"
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            About
          </Link>

          {/* Auth buttons — not functional yet, we wire these up in Phase 6 */}
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

      </div>
    </nav>
  )
}