// components/admin/AdminDrawer.tsx
// Manages the mobile drawer — open state, backdrop, slide animation
// Wraps AdminSidebar in a sliding panel on mobile

"use client"

import { useState, useEffect } from "react"
import AdminSidebar            from "@/components/admin/AdminSidebar"
import MobileAdminHeader       from "@/components/admin/MobileAdminHeader"

interface Props {
  children: React.ReactNode
}

export default function AdminDrawer({ children }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <div className="flex gap-6 lg:gap-8">

      {/* ── Desktop sidebar (always visible on lg+) ─────── */}
      <div className="hidden lg:block shrink-0">
        <AdminSidebar />
      </div>

      {/* ── Mobile drawer ────────────────────────────────── */}

      {/* Backdrop — dark overlay behind the drawer */}
      {/* Only renders when isOpen is true */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer panel — slides in from the left */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-gray-950 border-r border-gray-800
        z-50 p-6 lg:hidden
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <AdminSidebar isDrawer onClose={() => setIsOpen(false)} />
      </div>

      {/* ── Page content ─────────────────────────────────── */}
      <main className="flex-1 min-w-0 overflow-hidden">
        {/* Mobile header with hamburger button */}
        <MobileAdminHeader onOpen={() => setIsOpen(true)} />

        {/* Actual page content */}
        {children}
      </main>

    </div>
  )
}