// app/page.tsx
import FeatureCard from "@/components/ui/FeatureCard"
import YMMSelector from "@/components/ui/YMMSelector"

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <h1 className="text-5xl font-bold text-orange-500 mb-4">
          Motor Shop
        </h1>
        <p className="text-xl text-gray-400 max-w-xl mb-10">
          Find the right parts for your vehicle. Search by Year, Make, and Model.
        </p>

        {/* YMM Selector lives here on the homepage */}
        <YMMSelector />
      </section>

      {/* Feature Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-6 pb-24">
        <FeatureCard
          title="YMM Search"
          description="Filter parts by Year, Make, and Model for a perfect fit."
        />
        <FeatureCard
          title="Wide Selection"
          description="Thousands of parts and accessories for all vehicle types."
        />
        <FeatureCard
          title="Fast Shipping"
          description="Order today and get your parts delivered to your door."
        />
      </section>
    </div>
  )
}