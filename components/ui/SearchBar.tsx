"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback } from "react"

export default function SearchBar({ defaultValue }: { defaultValue?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleSearch = useCallback(
    (term: string) => {
      const params = new URLSearchParams(searchParams.toString())

      if (term) {
        params.set("search", term)
      } else {
        params.delete("search")
      }

      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search parts..."
        defaultValue={defaultValue}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm"
      />
    </div>
  )
}