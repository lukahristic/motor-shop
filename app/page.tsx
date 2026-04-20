// app/page.tsx

// This is your homepage — the component that renders at http://localhost:3000
// In Next.js App Router, every page.tsx file is automatically a route

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">

      {/* ── Hero Section ── */}
      <section className="flex flex-col items-center justify-center py-24 px-6 text-center">
        <h1 className="text-5xl font-bold text-orange-500 mb-4">
          Motor Shop
        </h1>
        <p className="text-xl text-gray-400 max-w-xl">
          Find the right parts for your vehicle. Search by Year, Make, and Model.
        </p>
        <button className="mt-8 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors">
          Browse Parts
        </button>
      </section>

      {/* ── Feature Cards ── */}
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
        <FeatureCard
          title="Offer Discounts"
          description="Order today and get discounts up to 50 percent!."
        />
      </section>

    </main>
  )
}

// ── FeatureCard Component (defined in same file for now) ──
// Notice the TypeScript interface defining exactly what props this component accepts

interface FeatureCardProps {
  title: string
  description: string
}

function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-yellow-400 mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  )
}