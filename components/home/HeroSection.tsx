// components/home/HeroSection.tsx
"use client"

import Link           from "next/link"
import { useEffect, useState } from "react"

export default function HeroSection() {
  // Simple fade-in on mount
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <section className="relative bg-gray-950 overflow-hidden">

      {/* Orange top accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-orange-500 z-10" />

      {/* Left vertical accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 z-10" />

      {/* Background decorative bike silhouette */}
      <div
        className="absolute right-0 top-0 bottom-0 flex items-center
                   justify-end pr-8 md:pr-24 opacity-[0.04]
                   select-none pointer-events-none text-[200px] md:text-[320px]"
        aria-hidden="true"
      >
        🏍️
      </div>

      {/* Overlay gradient — fades the silhouette on the left */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/90 to-transparent" />

      {/* Content */}
      <div
        className={`
          relative z-10 max-w-6xl mx-auto px-4 sm:px-6
          py-20 sm:py-28 md:py-36
          transition-all duration-700
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        `}
      >
        {/* Eyebrow label */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-0.5 bg-orange-500" />
          <span className="text-orange-500 text-xs font-bold tracking-[2px] uppercase">
            Philippines no. 1 motorcycle parts store
          </span>
        </div>

        {/* Main headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white
                       leading-[1.05] tracking-tight mb-5 max-w-2xl">
          Built for riders,{" "}
          <span className="text-orange-500">by riders</span>
        </h1>

        {/* Supporting text */}
        <p className="text-gray-400 text-base sm:text-lg leading-relaxed
                      mb-8 max-w-lg">
          Genuine parts and accessories for big bikes, scooters, and everything
          in between. Fast delivery across the Philippines.
        </p>

        {/* CTAs */}
        <div className="flex items-center gap-3 flex-wrap mb-12">
          <Link
            href="/products"
            className="px-7 py-3.5 bg-orange-500 hover:bg-orange-600
                       text-white font-bold rounded-lg text-sm
                       transition-all hover:-translate-y-0.5 active:scale-95"
          >
            Shop parts now
          </Link>
          <Link
            href="/products?category=Accessories"
            className="px-7 py-3.5 bg-transparent hover:bg-gray-800
                       text-white border border-gray-700
                       hover:border-orange-500 hover:text-orange-400
                       font-medium rounded-lg text-sm transition-all"
          >
            Browse accessories
          </Link>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-6 sm:gap-10 flex-wrap">
          {[
            { num: "5,000+", label: "Parts in stock"    },
            { num: "48hr",   label: "Metro delivery"    },
            { num: "100%",   label: "Genuine parts"     },
            { num: "4.9★",   label: "Customer rating"   },
          ].map((stat, i, arr) => (
            <div key={stat.label} className="flex items-center gap-6 sm:gap-10">
              <div>
                <p className="text-white text-xl sm:text-2xl font-extrabold">
                  {stat.num}
                </p>
                <p className="text-gray-500 text-xs uppercase tracking-wide mt-0.5">
                  {stat.label}
                </p>
              </div>
              {i < arr.length - 1 && (
                <div className="w-px h-8 bg-gray-800 hidden sm:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}