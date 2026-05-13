// components/layout/AccountDropdown.tsx
// Shows user name + dropdown with account links when logged in.
// Shows Login / Register when logged out.

"use client"

import Link              from "next/link"
import { useState, useRef, useEffect } from "react"
import { useAuth }       from "@/lib/auth-context"
import { useRouter }     from "next/navigation"
import { accountLinks }  from "@/lib/navbar-data"

export default function AccountDropdown() {
  const { user, loading, logout } = useAuth()
  const router                    = useRouter()
  const [open, setOpen]           = useState(false)
  const ref                       = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  async function handleLogout() {
    setOpen(false)
    await logout()
    router.push("/")
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="w-8 h-8 bg-gray-800 rounded-full animate-pulse" />
    )
  }

  // Logged out — show Login + Register
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="text-gray-400 hover:text-white text-sm
                     transition-colors font-medium hidden sm:block"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600
                     text-white text-sm font-semibold rounded-lg
                     transition-colors"
        >
          Register
        </Link>
      </div>
    )
  }

  // Logged in — show avatar + dropdown
  return (
    <div ref={ref} className="relative">

      {/* Avatar trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 p-1.5 rounded-xl
                   hover:bg-gray-800 transition-colors"
        aria-expanded={open}
        aria-label="Account menu"
      >
        {/* Avatar circle with initial */}
        <div className="w-8 h-8 rounded-full bg-orange-500/20
                        border border-orange-500/40
                        flex items-center justify-center shrink-0">
          <span className="text-orange-400 text-xs font-bold">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* Name — hidden on small screens */}
        <span className="text-gray-300 text-sm font-medium
                         hidden lg:block max-w-[100px] truncate">
          {user.name.split(" ")[0]}
        </span>

        <i
          className={`ti ti-chevron-down text-gray-500 text-xs
                      transition-transform duration-200
                      hidden lg:block ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-60 bg-gray-900
                     border border-gray-800 rounded-xl shadow-2xl
                     shadow-black/50 overflow-hidden z-50"
        >
          {/* User info header */}
          <div className="px-4 py-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/20
                              border border-orange-500/40
                              flex items-center justify-center shrink-0">
                <span className="text-orange-400 text-sm font-bold">
                  {user.name.charAt(0).toUpperCase()}
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

            {/* Admin badge */}
            {user.role === "ADMIN" && (
              <div className="mt-3">
                <span className="bg-orange-500/10 border border-orange-500/30
                                 text-orange-400 text-xs font-bold
                                 px-2 py-1 rounded-md">
                  Admin account
                </span>
              </div>
            )}
          </div>

          {/* Nav links */}
          <div className="p-2">
            {accountLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5
                           rounded-lg hover:bg-gray-800
                           transition-colors group"
              >
                <i
                  className={`ti ${link.icon} text-gray-500
                              group-hover:text-orange-400
                              transition-colors text-base`}
                  aria-hidden="true"
                />
                <span className="text-gray-300 group-hover:text-white
                                 text-sm transition-colors">
                  {link.label}
                </span>
              </Link>
            ))}

            {/* Admin dashboard link */}
            {user.role === "ADMIN" && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5
                           rounded-lg hover:bg-orange-500/10
                           transition-colors group"
              >
                <i className="ti ti-layout-dashboard text-orange-500
                              text-base" aria-hidden="true" />
                <span className="text-orange-400 text-sm font-medium">
                  Admin dashboard
                </span>
              </Link>
            )}
          </div>

          {/* Logout */}
          <div className="p-2 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5
                         rounded-lg hover:bg-red-500/10 transition-colors
                         group text-left"
            >
              <i className="ti ti-logout text-gray-500
                            group-hover:text-red-400 transition-colors
                            text-base" aria-hidden="true" />
              <span className="text-gray-400 group-hover:text-red-400
                               text-sm transition-colors">
                Sign out
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}