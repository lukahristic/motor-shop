// components/layout/CategoriesDropdown.tsx
// Hoverable dropdown showing the three main categories.
// Desktop only — mobile uses the drawer instead.

"use client"

import Link                from "next/link"
import { useState }        from "react"
import { categoryLinks }   from "@/lib/navbar-data"

export default function CategoriesDropdown() {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Trigger */}
      <button
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg
                    text-sm font-medium transition-colors ${
                      open
                        ? "text-orange-400 bg-gray-800"
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                    }`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        Categories
        <i
          className={`ti ti-chevron-down text-xs transition-transform
                      duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute top-full left-0 mt-2 w-72 bg-gray-900
                     border border-gray-800 rounded-xl shadow-2xl
                     shadow-black/50 overflow-hidden z-50"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-800">
            <p className="text-gray-500 text-xs font-semibold uppercase
                          tracking-widest">
              Shop by vehicle type
            </p>
          </div>

          {/* Category links */}
          <div className="p-2">
            {categoryLinks.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="flex items-center gap-3 px-3 py-3 rounded-lg
                           hover:bg-gray-800 transition-colors group"
              >
                {/* Emoji icon */}
                <span className="text-2xl w-10 h-10 bg-gray-800
                                 group-hover:bg-gray-700 rounded-lg
                                 flex items-center justify-center
                                 shrink-0 transition-colors">
                  {cat.emoji}
                </span>

                <div>
                  <p className="text-white text-sm font-semibold
                                group-hover:text-orange-400
                                transition-colors">
                    {cat.label}
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {cat.description}
                  </p>
                </div>

                <i className="ti ti-arrow-right text-gray-700
                              group-hover:text-orange-500 ml-auto
                              transition-colors text-sm"
                   aria-hidden="true" />
              </Link>
            ))}
          </div>

          {/* Footer link */}
          <div className="px-4 py-3 border-t border-gray-800">
            <Link
              href="/products"
              className="text-orange-400 hover:text-orange-300
                         text-xs font-semibold transition-colors
                         flex items-center gap-1"
            >
              Browse all products
              <i className="ti ti-arrow-right text-xs" aria-hidden="true" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}