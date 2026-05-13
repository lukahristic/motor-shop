// components/layout/Navbar.tsx
// Premium navbar with categories dropdown, search, cart,
// account dropdown, and mobile hamburger + drawer.

"use client"

import Link                  from "next/link"
import { useState }          from "react"
import CartIcon              from "@/components/ui/CartIcon"
import NavSearch             from "@/components/layout/NavSearch"
import CategoriesDropdown    from "@/components/layout/CategoriesDropdown"
import AccountDropdown       from "@/components/layout/AccountDropdown"
import MobileNavDrawer       from "@/components/layout/MobileNavDrawer"
import { shopLinks }         from "@/lib/navbar-data"

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-30 bg-gray-950/95 backdrop-blur-sm
                         border-b border-gray-800">

        {/* ── Top announcement bar ────────────────────────── */}
        <div className="bg-orange-500 px-4 py-1.5 text-center hidden sm:block">
          <p className="text-white text-xs font-semibold">
            🏍️ Free shipping on orders ₱1,500 and above — Metro Manila 48hr delivery
          </p>
        </div>

        {/* ── Main navbar row ─────────────────────────────── */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4 h-16">

            {/* ── Logo ──────────────────────────────────────── */}
            <Link
              href="/"
              className="text-orange-500 font-extrabold text-xl
                         tracking-tight shrink-0 mr-2"
            >
              MotorShop
            </Link>

            {/* ── Desktop nav links ─────────────────────────── */}
            <div className="hidden lg:flex items-center gap-1 flex-1">

              {/* Categories dropdown */}
              <CategoriesDropdown />

              {/* Quick shop links */}
              {shopLinks.slice(0, 4).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 rounded-lg text-gray-400
                             hover:text-white hover:bg-gray-800
                             text-sm font-medium transition-colors
                             whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* ── Right side actions ────────────────────────── */}
            <div className="flex items-center gap-1 ml-auto">

              {/* Search — desktop */}
              <div className="hidden sm:block">
                <NavSearch />
              </div>

              {/* Cart icon with badge */}
              <CartIcon />

              {/* Account dropdown — desktop */}
              <div className="hidden sm:block">
                <AccountDropdown />
              </div>

              {/* Hamburger — mobile only */}
              <button
                onClick={() => setDrawerOpen(true)}
                aria-label="Open navigation menu"
                className="lg:hidden p-2 rounded-lg text-gray-400
                           hover:text-white hover:bg-gray-800
                           transition-colors"
              >
                <i className="ti ti-menu-2 text-xl" aria-hidden="true" />
              </button>
            </div>

          </div>
        </nav>

      </header>

      {/* ── Mobile drawer ─────────────────────────────────── */}
      <MobileNavDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  )
}