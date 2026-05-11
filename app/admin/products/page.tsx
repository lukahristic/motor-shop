// app/admin/products/page.tsx
import { prisma }               from "@/lib/prisma"
import Link                     from "next/link"
import DeleteProductButton       from "@/components/admin/DeleteProductButton"

export const dynamic = "force-dynamic"

async function getProducts() {
  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  })
}

export default async function AdminProductsPage() {
  const products = await getProducts()

  return (
    <div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Products</h1>
          <p className="text-gray-500 text-sm">{products.length} total</p>
        </div>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors shrink-0"
        >
          + Add Product
        </Link>
      </div>

      {/* ── DESKTOP TABLE (hidden on mobile) ─────────────── */}
      <div className="hidden md:block bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              {["Product", "Category", "Price", "Stock", "Actions"].map((h) => (
                <th
                  key={h}
                  className="text-left text-gray-500 text-xs font-medium uppercase tracking-wide px-4 py-3"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-gray-800 last:border-0 hover:bg-gray-800/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <p className="text-white text-sm font-medium">
                    {product.name}
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5">{product.slug}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="text-orange-400 text-xs font-medium">
                    {product.category}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-white text-sm">
                    ${parseFloat(String(product.price)).toFixed(2)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    product.inStock
                      ? "bg-green-900 text-green-400"
                      : "bg-red-900 text-red-400"
                  }`}>
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="text-gray-400 hover:text-white text-xs transition-colors"
                    >
                      Edit
                    </Link>
                    <DeleteProductButton
                      productId={product.id}
                      productName={product.name}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── MOBILE CARDS (hidden on desktop) ─────────────── */}
      <div className="md:hidden space-y-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4"
          >
            {/* Top row — name + stock badge */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="min-w-0">
                <p className="text-white font-medium text-sm truncate">
                  {product.name}
                </p>
                <p className="text-gray-500 text-xs mt-0.5 truncate">
                  {product.slug}
                </p>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${
                product.inStock
                  ? "bg-green-900 text-green-400"
                  : "bg-red-900 text-red-400"
              }`}>
                {product.inStock ? "In Stock" : "Out"}
              </span>
            </div>

            {/* Middle row — category + price */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-orange-400 text-xs font-medium">
                {product.category}
              </span>
              <span className="text-white font-semibold text-sm">
                ${parseFloat(String(product.price)).toFixed(2)}
              </span>
            </div>

            {/* Bottom row — actions */}
            <div className="flex items-center gap-4 pt-3 border-t border-gray-800">
              <Link
                href={`/admin/products/${product.id}/edit`}
                className="flex-1 text-center py-2 text-sm text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Edit
              </Link>
              <div className="flex-1 flex justify-center">
                <DeleteProductButton
                  productId={product.id}
                  productName={product.name}
                />
              </div>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="text-center py-12 text-gray-500 text-sm">
            No products yet
          </div>
        )}
      </div>

    </div>
  )
}