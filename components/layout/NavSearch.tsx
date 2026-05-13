// components/layout/NavSearch.tsx
// Expandable search bar in the navbar.
// Collapsed by default, expands on click.

"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter }                   from "next/navigation"

export default function NavSearch() {
  const router              = useRouter()
  const [open, setOpen]     = useState(false)
  const [query, setQuery]   = useState("")
  const inputRef            = useRef<HTMLInputElement>(null)

  // Focus input when expanded
  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false)
        setQuery("")
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    router.push(`/products?search=${encodeURIComponent(query.trim())}`)
    setOpen(false)
    setQuery("")
  }

  return (
    <div className="relative flex items-center">
      {/* Expanded search form */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => { setOpen(false); setQuery("") }}
          />
          <form
            onSubmit={handleSubmit}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-50
                       flex items-center gap-2 bg-gray-900 border
                       border-orange-500 rounded-xl px-3 py-2
                       shadow-xl shadow-orange-500/10 w-72"
          >
            <i className="ti ti-search text-orange-500 text-sm shrink-0"
               aria-hidden="true" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search parts, brands..."
              className="flex-1 bg-transparent text-white text-sm
                         placeholder:text-gray-600 outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-gray-600 hover:text-white transition-colors text-xs"
              >
                ✕
              </button>
            )}
          </form>
        </>
      )}

      {/* Search icon trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Search"
        className={`p-2 rounded-lg transition-colors ${
          open
            ? "text-orange-500"
            : "text-gray-400 hover:text-white hover:bg-gray-800"
        }`}
      >
        <i className="ti ti-search text-lg" aria-hidden="true" />
      </button>
    </div>
  )
}