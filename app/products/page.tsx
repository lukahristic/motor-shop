// app/products/page.tsx
// Server Component — fetches data on the server, ships HTML to browser
// No "use client" needed — no state, no interaction here

import ProductCard from "@/components/ui/ProductCard"
import { Product } from "@/types"

import SearchBar from "@/components/ui/SearchBar"
import CategoryFilter from "@/components/ui/CategoryFilter"

// This function runs on the SERVER before the page renders
async function getProducts(): Promise<Product[]> {
  try {
    // In production this would be your real domain
    // process.env.NEXT_PUBLIC_API_URL is set in .env
    const res = await fetch("http://localhost:3000/api/products", {
      // Tell Next.js not to cache this — always get fresh data
      cache: "no-store",
    })

    if (!res.ok) throw new Error("Failed to fetch products")

    const json = await res.json()
    return json.data
  } catch (error) {
    console.error("Failed to fetch products:", error)
    return []
  }
}

interface ProductsPageProps {
  // Next.js passes URL query params here automatically
  searchParams: Promise<{ 
    year?: string
    make?: string
    model?: string
    category?: string
    search?: string
  }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const products = await getProducts()

  // Filter products client-side for now
  // Phase 5 Step 3 moves this filter to the API query
  const filtered = products.filter((p) => {
    const matchesCategory = params.category
      ? p.category === params.category
      : true

    const matchesSearch = params.search
      ? p.name.toLowerCase().includes(params.search.toLowerCase()) ||
        p.description?.toLowerCase().includes(params.search.toLowerCase())
      : true

    return matchesCategory && matchesSearch
  })

  // Get unique categories from products for the filter bar
  const categories = ["All", ...new Set(products.map((p) => p.category))]

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-1">All Products</h1>

        {/* Show active YMM filter if present */}
        {params.year && params.make && params.model && (
          <p className="text-orange-400 text-sm">
            Showing parts for: {params.year} {params.make} {params.model}
          </p>
        )}

        <p className="text-gray-500 text-sm mt-1">
          {filtered.length} parts found
        </p>
      </div>

      {/* Search Bar */}
      <SearchBar defaultValue={params.search} />

      {/* Category Filter */}
      <CategoryFilter
        categories={categories}
        active={params.category}
      />

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-gray-500 text-lg">No products found.</p>
          <a href="/products" className="text-orange-400 text-sm mt-2 inline-block">
            Clear filters
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  )
}

// ── SearchBar (Client Component — needs user input) ──────────────
// Separate "use client" component inside the same file
// This is a pattern: server page, client islands


