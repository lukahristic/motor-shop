// app/page.tsx
// New premium homepage — assembled from section components.
// Each section is independently maintainable.

import HeroSection        from "@/components/home/HeroSection"
import FindMyFitBar       from "@/components/home/FindMyFitBar"
import TrustBar           from "@/components/home/TrustBar"
import CategorySection    from "@/components/home/CategorySection"
import FeaturedProducts   from "@/components/home/FeaturedProducts"
import BrandsStrip        from "@/components/home/BrandsStrip"
import WhySection         from "@/components/home/WhySection"
import ReviewsSection     from "@/components/home/ReviewsSection"
import NewsletterSection from "@/components/home/NewsletterSection"

export default function HomePage() {
  return (
    <div className="bg-gray-950">

      {/* 1. Hero — full width, strong headline, CTAs, stats */}
      <HeroSection />

      {/* 2. Find My Fit — compact YMM bar, not the main focus */}
      <FindMyFitBar />

      {/* 3. Trust bar — shipping, genuine, support */}
      <TrustBar />

      {/* 4. Category banners — Big Bikes, Scooters, Accessories */}
      <CategorySection />

      {/* 5. Featured products — hot deals from the database */}
      <FeaturedProducts />

      {/* 6. Brand logos strip */}
      <BrandsStrip />

      {/* 7. Why shop with us — 4 trust columns */}
      <WhySection />

      {/* 8. Customer reviews */}
      <ReviewsSection />

      {/* 9. Newsletter signup */}
      <NewsletterSection />
    </div>
  )
}