"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"

export default function CategoryFilter({
  categories,
  active,
}: {
  categories: string[]
  active?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function handleCategory(cat: string) {
    const params = new URLSearchParams(searchParams.toString())

    if (cat === "All") {
      params.delete("category")
    } else {
      params.set("category", cat)
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex gap-2 sm:gap-3 mb-6 sm:mb-8 flex-wrap">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => handleCategory(cat)}
          className={`px-4 py-2 rounded-lg text-sm ${
            (cat === "All" && !active) || cat === active
              ? "bg-orange-500 text-white"
              : "bg-gray-800 text-gray-300"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}