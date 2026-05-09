// app/admin/products/page.tsx
// Lists all products with edit and delete actions

import { prisma } from "@/lib/prisma"
import Link       from "next/link"
import DeleteProductButton from "@/components/admin/DeleteProductButton"

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
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          + Add Product
        </Link>
      </div>

      {/* Products Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left text-gray-500 text-xs font-medium uppercase tracking-wide px-4 py-3">
                Product
              </th>
              <th className="text-left text-gray-500 text-xs font-medium uppercase tracking-wide px-4 py-3">
                Category
              </th>
              <th className="text-left text-gray-500 text-xs font-medium uppercase tracking-wide px-4 py-3">
                Price
              </th>
              <th className="text-left text-gray-500 text-xs font-medium uppercase tracking-wide px-4 py-3">
                Stock
              </th>
              <th className="text-right text-gray-500 text-xs font-medium uppercase tracking-wide px-4 py-3">
                Actions
              </th>
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
                  <p className="text-gray-500 text-xs mt-0.5">
                    {product.slug}
                  </p>
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
                  <div className="flex items-center justify-end gap-2">
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

    </div>
  )
}