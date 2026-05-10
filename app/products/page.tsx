// app/products/page.tsx
import ProductCard from "@/components/ui/ProductCard"
import SearchBar from "@/components/ui/SearchBar"
import CategoryFilter from "@/components/ui/CategoryFilter"
import { Product } from "@/types"
import {
  getAllProductsForCatalog,
  getProductsByVehicle,
} from "@/lib/products-data"

async function getProducts(params: {
  year?: string
  make?: string
  model?: string
}): Promise<Product[]> {
  try {
    const { year, make, model } = params

    if (year && make && model) {
      const result = await getProductsByVehicle({ year, make, model })
      if (!result.vehicleFound) return []
      return result.products
    }

    return getAllProductsForCatalog()
  } catch (error) {
    console.error("Failed to fetch products:", error)
    return []
  }
}

interface ProductsPageProps {
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

  // Fetch products — filtered by vehicle if YMM params exist
  const products = await getProducts({
    year: params.year,
    make: params.make,
    model: params.model,
  })

  // Apply category + search filters on top of YMM results
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

  const categories = ["All", ...new Set(products.map((p) => p.category))]
  const hasVehicleFilter = params.year && params.make && params.model

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-1">
          {hasVehicleFilter ? "Parts for Your Vehicle" : "All Products"}
        </h1>

        {/* Active vehicle badge */}
        {hasVehicleFilter && (
          <div className="flex items-center gap-3 mt-2">
            <span className="text-orange-400 text-sm font-medium">
              {params.year} {params.make} {params.model}
            </span>
            
            <a href="/products" className="text-xs text-gray-500 hover:text-gray-300 underline transition-colors">
              Clear vehicle filter
            </a>
          </div>
        )}

        <p className="text-gray-500 text-sm mt-1">
          {filtered.length} parts found
        </p>
      </div>

      {/* Search */}
      <SearchBar defaultValue={params.search} />

      {/* Category filter */}
      <CategoryFilter categories={categories} active={params.category} />

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-gray-500 text-lg mb-2">
            {hasVehicleFilter
              ? `No parts found for ${params.year} ${params.make} ${params.model}`
              : "No products found."
            }
          </p>
          
            <a href="/products" className="text-orange-400 text-sm hover:text-orange-300 transition-colors">
            Browse all products
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