// app/products/[slug]/page.tsx
import Image     from "next/image"
import Link      from "next/link"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import AddToCartButton from "@/components/ui/AddToCartButton"
import { getPriceInfo, formatPHP, getStockStatus } from "@/lib/price"
import { imageSrc } from "@/lib/image-src"


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
  }
)

  if (!product) notFound()

  const priceInfo = getPriceInfo(
    Number(product.price),
    product.salePrice ? Number(product.salePrice) : null
  )
  
  const stock = getStockStatus(product.inStock, product.stockCount)


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
            src={imageSrc(product.imageUrl)}
            alt={product.name}
            fill
            className={`object-cover ${!product.inStock ? "grayscale opacity-55" : ""}`}
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/45 pointer-events-none" />
          )}
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

          <div className="mb-6">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className={`text-4xl font-extrabold ${
                priceInfo.isOnSale ? "text-orange-500" : "text-white"
              }`}>
                {formatPHP(priceInfo.displayPrice)}
              </span>
              {priceInfo.isOnSale && (
                <>
                  <span className="text-gray-600 text-xl line-through">
                    {formatPHP(priceInfo.originalPrice)}
                  </span>
                  <span className="bg-red-600 text-white text-sm font-bold
                                  px-3 py-1 rounded-lg">
                    -{priceInfo.discountPercent}% OFF
                  </span>
                </>
              )}
            </div>
            {priceInfo.isOnSale && (
              <p className="text-green-400 text-sm font-semibold mt-1">
                You save {formatPHP(priceInfo.discountAmount)}
              </p>
            )}
          </div>

          <div className="mb-6">
            <span className={`inline-block text-sm font-semibold px-3 py-1.5
                            rounded-full ${stock.className}`}>
              {stock.label}
            </span>
          </div>


          <AddToCartButton
            inStock={stock.canAdd}
            product={{
              productId: product.id,
              name:      product.name,
              price:     priceInfo.displayPrice,
              imageUrl:  product.imageUrl,
              slug:      product.slug,
            }}
          />
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