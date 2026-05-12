// components/home/CategorySection.tsx
import Link             from "next/link"
import { categories }   from "@/lib/homepage-data"

export default function CategorySection() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">

      {/* Section header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-6 h-0.5 bg-orange-500" />
          <span className="text-orange-500 text-xs font-bold tracking-widest uppercase">
            Shop by category
          </span>
        </div>
        <h2 className="text-white text-2xl sm:text-3xl font-extrabold tracking-tight">
          What are you riding?
        </h2>
      </div>

      {/* 3-column grid — stacks on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <Link
            key={cat.title}
            href={cat.href}
            className="group relative rounded-2xl overflow-hidden
                       border border-gray-800 hover:border-orange-500
                       transition-all duration-300 hover:-translate-y-1
                       bg-gray-900 block"
          >
            {/* Tall image area with emoji placeholder */}
            <div className="relative h-56 sm:h-64 bg-gray-900 flex items-center justify-center overflow-hidden">

              {/* Background gradient accent */}
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.accent} opacity-60`} />

              {/* Emoji silhouette — replace with real images later */}
              <span
                className="relative z-10 text-[96px] opacity-20
                           group-hover:opacity-30 group-hover:scale-110
                           transition-all duration-500 select-none"
                aria-hidden="true"
              >
                {cat.emoji}
              </span>

              {/* Brand tags overlay */}
              <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap gap-1.5">
                {cat.brands.map((b) => (
                  <span
                    key={b}
                    className="bg-black/60 text-gray-300 text-xs font-semibold
                               px-2 py-0.5 rounded-md"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>

            {/* Text content */}
            <div className="p-5">
              <h3 className="text-white font-bold text-lg mb-1.5
                             group-hover:text-orange-400 transition-colors">
                {cat.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                {cat.description}
              </p>
              <span className="inline-flex items-center gap-1.5 text-orange-500
                               text-sm font-semibold group-hover:gap-3
                               transition-all duration-200">
                Shop now
                <i className="ti ti-arrow-right" aria-hidden="true" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}