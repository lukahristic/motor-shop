// components/home/TrustBar.tsx
import { trustItems } from "@/lib/homepage-data"

export default function TrustBar() {
  return (
    <div className="bg-orange-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          {trustItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 text-white"
            >
              <i
                className={`ti ${item.icon} text-base`}
                aria-hidden="true"
              />
              <span className="text-xs font-semibold whitespace-nowrap">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}