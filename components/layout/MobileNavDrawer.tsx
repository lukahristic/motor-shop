// components/layout/MobileNavDrawer.tsx
// Full-screen slide-in drawer for mobile navigation.
// Contains all links, categories, and auth state.

"use client"

import Link              from "next/link"
import { useEffect }     from "react"
import { useAuth }       from "@/lib/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { categoryLinks, shopLinks, accountLinks } from "@/lib/navbar-data"

interface Props {
  open:    boolean
  onClose: () => void
}

export default function MobileNavDrawer({ open, onClose }: Props) {
  const { user, logout } = useAuth()
  const router           = useRouter()
  const pathname         = usePathname()

  // Close on route change
  useEffect(() => {
    onClose()
  }, [pathname])

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  async function handleLogout() {
    onClose()
    await logout()
    router.push("/")
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/70 z-40 lg:hidden
                    transition-opacity duration-300 ${
                      open ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] bg-gray-950
                    border-r border-gray-800 z-50 lg:hidden
                    flex flex-col overflow-y-auto
                    transform transition-transform duration-300 ease-out ${
                      open ? "translate-x-0" : "-translate-x-full"
                    }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between
                        px-5 py-4 border-b border-gray-800 shrink-0">
          <Link
            href="/"
            className="text-orange-500 font-extrabold text-xl"
            onClick={onClose}
          >
            MotorShop
          </Link>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-2 rounded-lg text-gray-400 hover:text-white
                       hover:bg-gray-800 transition-colors"
          >
            <i className="ti ti-x text-lg" aria-hidden="true" />
          </button>
        </div>

        {/* Drawer content */}
        <div className="flex-1 px-4 py-5 space-y-6">

          {/* Categories */}
          <div>
            <p className="text-gray-600 text-xs font-bold uppercase
                          tracking-widest px-2 mb-3">
              Shop by vehicle
            </p>
            <div className="space-y-1">
              {categoryLinks.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="flex items-center gap-3 px-3 py-3
                             rounded-xl hover:bg-gray-800
                             transition-colors group"
                >
                  <span className="text-xl w-9 h-9 bg-gray-800
                                   rounded-lg flex items-center
                                   justify-center shrink-0">
                    {cat.emoji}
                  </span>
                  <div>
                    <p className="text-white text-sm font-semibold
                                  group-hover:text-orange-400
                                  transition-colors">
                      {cat.label}
                    </p>
                    <p className="text-gray-600 text-xs">
                      {cat.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Shop links */}
          <div>
            <p className="text-gray-600 text-xs font-bold uppercase
                          tracking-widest px-2 mb-3">
              Quick links
            </p>
            <div className="space-y-0.5">
              {shopLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-3 py-2.5
                             rounded-lg hover:bg-gray-800
                             text-gray-400 hover:text-white
                             text-sm font-medium transition-colors"
                >
                  <i className="ti ti-arrow-right text-gray-700
                                text-xs" aria-hidden="true" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Account section */}
          {user ? (
            <div>
              <p className="text-gray-600 text-xs font-bold uppercase
                            tracking-widest px-2 mb-3">
                My account
              </p>

              {/* User info */}
              <div className="flex items-center gap-3 px-3 py-3
                              bg-gray-900 rounded-xl mb-2">
                <div className="w-9 h-9 rounded-full bg-orange-500/20
                                border border-orange-500/40
                                flex items-center justify-center shrink-0">
                  <span className="text-orange-400 text-sm font-bold">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-semibold truncate">
                    {user.name}
                  </p>
                  <p className="text-gray-500 text-xs truncate">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Account links */}
              <div className="space-y-0.5">
                {accountLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 px-3 py-2.5
                               rounded-lg hover:bg-gray-800
                               text-gray-400 hover:text-white
                               text-sm transition-colors"
                  >
                    <i
                      className={`ti ${link.icon} text-gray-600 text-base`}
                      aria-hidden="true"
                    />
                    {link.label}
                  </Link>
                ))}

                {/* Admin link */}
                {user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 px-3 py-2.5
                               rounded-lg hover:bg-orange-500/10
                               text-orange-400 text-sm font-medium
                               transition-colors"
                  >
                    <i className="ti ti-layout-dashboard text-orange-500
                                  text-base" aria-hidden="true" />
                    Admin dashboard
                  </Link>
                )}

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5
                             rounded-lg hover:bg-red-500/10
                             text-gray-500 hover:text-red-400
                             text-sm transition-colors text-left"
                >
                  <i className="ti ti-logout text-base" aria-hidden="true" />
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 text-xs font-bold uppercase
                            tracking-widest px-2 mb-3">
                Account
              </p>
              <div className="space-y-2">
                <Link
                  href="/login"
                  className="block w-full px-4 py-3 text-center
                             border border-gray-700 hover:border-orange-500
                             text-gray-300 hover:text-orange-400
                             rounded-xl text-sm font-semibold
                             transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="block w-full px-4 py-3 text-center
                             bg-orange-500 hover:bg-orange-600
                             text-white rounded-xl text-sm font-bold
                             transition-colors"
                >
                  Create account
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Drawer footer */}
        <div className="px-5 py-4 border-t border-gray-800 shrink-0">
          <p className="text-gray-700 text-xs text-center">
            © {new Date().getFullYear()} MotorShop.
            All rights reserved.
          </p>
        </div>
      </div>
    </>
  )
}