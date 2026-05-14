// components/admin/AdminSidebar.tsx
"use client"

import Link              from "next/link"
import { usePathname }   from "next/navigation"
import { useEffect }     from "react"

const links = [
  { href: "/admin",           label: "Dashboard"  },
  { href: "/admin/products",  label: "Products"   },
  { href: "/admin/orders",    label: "Orders"     },
  { href: "/admin/discounts", label: "Discounts"  }, 
  { href: "/admin/ymm",       label: "YMM Data"   },
]

interface Props {

  isDrawer?:  boolean
  onClose?:   () => void
}

export default function AdminSidebar({ isDrawer = false, onClose }: Props) {
  const pathname = usePathname()

  useEffect(() => {
    if (isDrawer && onClose) {
      onClose()
    }
  }, [pathname])

  return (
    <aside className={isDrawer ? "w-64" : "w-48 shrink-0"}>

      {/* Header row — only shown inside drawer */}
      {isDrawer && (
        <div className="flex items-center justify-between mb-6">
          <p className="text-orange-500 font-bold text-lg">MotorShop</p>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
            aria-label="Close menu"
          >
            {/* X icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      )}

      {/* Panel label */}
      <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-4">
        Admin Panel
      </p>

      {/* Nav links */}
      <nav className="flex flex-col gap-1">
        {links.map((link) => {
          const isActive =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href)

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2.5 rounded-lg text-sm transition-colors ${
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