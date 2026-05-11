// app/products/[slug]/page.tsx
import Image     from "next/image"
import Link      from "next/link"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      // Fetch compatibility and navigate to year
      compatibilities: {
        include: {
          model: {
            include: {
              make: {
                include: { year: true },
              },
            },
          },
        },
      },
    },
  })

  if (!product) notFound()

  // Shape compatible vehicles for display
  const compatibleVehicles = product.compatibilities.map((c) => ({
    id:    c.id,
    year:  c.model.make.year.year,
    make:  c.model.make.name,
    model: c.model.name,
  }))

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">

      <Link
        href="/products"
        className="text-orange-400 hover:text-orange-300 text-sm mb-8 inline-block"
      >
        ← Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-6">

        {/* Image */}
        <div className="relative w-full h-80 rounded-xl overflow-hidden border border-gray-800">
          <Image
            src={
              product.imageUrl && product.imageUrl.trim() !== ""
                ? product.imageUrl
                : "https://placehold.co/400x300/1a1a1a/orange?text=No+Image"
            }
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <span className="text-orange-400 text-sm font-medium uppercase tracking-wide">
            {product.category}
          </span>

          <h1 className="text-3xl font-bold text-white mt-2 mb-4">
            {product.name}
          </h1>

          {product.description && (
            <p className="text-gray-400 text-base leading-relaxed mb-6">
              {product.description}
            </p>
          )}

          <div className="text-4xl font-bold text-white mb-4">
            ${Number(product.price).toFixed(2)}
          </div>

          <div className="mb-6">
            <span className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${
              product.inStock
                ? "bg-green-900 text-green-400"
                : "bg-red-900 text-red-400"
            }`}>
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <button
            disabled={!product.inStock}
            className={`py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
              product.inStock
                ? "bg-orange-500 hover:bg-orange-600"
                : "bg-gray-700 opacity-50 cursor-not-allowed"
            }`}
          >
            {product.inStock ? "Add to Cart" : "Unavailable"}
          </button>
        </div>
      </div>

      {/* Compatible Vehicles Section */}
      {compatibleVehicles.length > 0 && (
        <div className="mt-12">
          <h2 className="text-white font-bold text-xl mb-4">
            Compatible Vehicles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {compatibleVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-lg px-4 py-3"
              >
                <span className="bg-gray-800 text-orange-400 text-xs font-medium px-2 py-1 rounded-full shrink-0">
                  {vehicle.year}
                </span>
                <span className="text-gray-300 text-sm">
                  {vehicle.make} {vehicle.model}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}