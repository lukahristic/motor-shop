// components/home/BrandsStrip.tsx
import { brands } from "@/lib/homepage-data"

export default function BrandsStrip() {
  return (
    <section className="border-y border-gray-800 bg-gray-900/30 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <p className="text-center text-gray-600 text-xs font-semibold
                      uppercase tracking-[2px] mb-6">
          Stocking genuine parts for the Philippines' most popular brands
        </p>

        {/* Scrollable on mobile */}
        <div className="flex items-center justify-between gap-6
                        overflow-x-auto pb-1 sm:pb-0
                        sm:justify-around flex-nowrap sm:flex-wrap">
          {brands.map((brand) => (
            <span
              key={brand}
              className="text-gray-600 hover:text-orange-500 text-sm
                         font-extrabold tracking-[1.5px] uppercase
                         transition-colors cursor-pointer shrink-0"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}