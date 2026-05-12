// components/home/WhySection.tsx
import { whyItems } from "@/lib/homepage-data"

export default function WhySection() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">

      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-6 h-0.5 bg-orange-500" />
          <span className="text-orange-500 text-xs font-bold tracking-widest uppercase">
            Why MotorShop
          </span>
          <div className="w-6 h-0.5 bg-orange-500" />
        </div>
        <h2 className="text-white text-2xl sm:text-3xl font-extrabold tracking-tight">
          Why riders trust us
        </h2>
      </div>

      {/* 4 columns — 2 on mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {whyItems.map((item) => (
          <div
            key={item.title}
            className="bg-gray-900 border border-gray-800 rounded-xl
                       p-6 text-center hover:border-orange-500/50
                       transition-colors"
          >
            <div className="w-12 h-12 bg-orange-500/10 rounded-xl
                            flex items-center justify-center mx-auto mb-4">
              <i
                className={`ti ${item.icon} text-orange-500 text-2xl`}
                aria-hidden="true"
              />
            </div>
            <h3 className="text-white font-bold text-sm mb-2">
              {item.title}
            </h3>
            <p className="text-gray-500 text-xs leading-relaxed">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}