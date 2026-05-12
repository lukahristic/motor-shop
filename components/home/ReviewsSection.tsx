// components/home/ReviewsSection.tsx
import { reviews } from "@/lib/homepage-data"

export default function ReviewsSection() {
  return (
    <section className="bg-gray-900/50 py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-6 h-0.5 bg-orange-500" />
            <span className="text-orange-500 text-xs font-bold tracking-widest uppercase">
              Reviews
            </span>
            <div className="w-6 h-0.5 bg-orange-500" />
          </div>
          <h2 className="text-white text-2xl sm:text-3xl font-extrabold tracking-tight">
            What riders are saying
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Real customers, real reviews
          </p>
        </div>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6
                         hover:border-orange-500/40 transition-colors"
            >
              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, si) => (
                  <i
                    key={si}
                    className={`ti ti-star text-sm ${
                      si < review.stars
                        ? "text-amber-400"
                        : "text-gray-700"
                    }`}
                    aria-hidden="true"
                  />
                ))}
              </div>

              {/* Review text */}
              <p className="text-gray-400 text-sm leading-relaxed mb-5 italic">
                "{review.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                {/* Avatar initials */}
                <div className="w-9 h-9 rounded-full bg-orange-500/20
                                flex items-center justify-center shrink-0">
                  <span className="text-orange-400 text-xs font-bold">
                    {review.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">
                    {review.name}
                  </p>
                  <p className="text-gray-600 text-xs">{review.vehicle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}