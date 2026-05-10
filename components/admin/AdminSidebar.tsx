// components/admin/AdminSidebar.tsx
"use client"

import Link     from "next/link"
import { usePathname } from "next/navigation"

const links = [
  { href: "/admin",          label: "Dashboard" },
  { href: "/admin/products", label: "Products"  },
  { href: "/admin/ymm",      label: "YMM Data"  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-48 shrink-0">
      <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-4">
        Admin Panel
      </p>
      <nav className="flex flex-col gap-1">
        {links.map((link) => {
          // Exact match for dashboard, starts-with for others
          const isActive =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href)

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-orange-500 text-white font-medium"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              {link.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}