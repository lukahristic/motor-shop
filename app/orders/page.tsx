// app/orders/page.tsx
// Shows all orders for the currently logged-in user

import { prisma }   from "@/lib/prisma"
import { cookies }  from "next/headers"
import { verifyToken } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link         from "next/link"

export const dynamic = "force-dynamic"

async function getUserOrders(userId: number) {
  return prisma.order.findMany({
    where:   { userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: {
            select: {
              name:     true,
              slug:     true,
              imageUrl: true,
            },
          },
        },
      },
    },
  })
}

// Status badge colors
function getStatusStyle(status: string) {
  switch (status) {
    case "PAID":      return "bg-green-900 text-green-400"
    case "PENDING":   return "bg-yellow-900 text-yellow-400"
    case "SHIPPED":   return "bg-blue-900 text-blue-400"
    case "DELIVERED": return "bg-teal-900 text-teal-400"
    case "CANCELLED": return "bg-red-900 text-red-400"
    default:          return "bg-gray-800 text-gray-400"
  }
}

export default async function OrdersPage() {
  // Verify user is logged in
  const cookieStore = await cookies()
  const token       = cookieStore.get("auth-token")?.value

  if (!token) redirect("/login?redirect=/orders")

  let userId: number

  try {
    const payload = verifyToken(token)
    userId        = payload.id
  } catch {
    redirect("/login?redirect=/orders")
  }

  const orders = await getUserOrders(userId)

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">My Orders</h1>
        <p className="text-gray-500 text-sm">
          {orders.length} {orders.length === 1 ? "order" : "orders"} total
        </p>
      </div>

      {/* Empty state */}
      {orders.length === 0 ? (
        <div className="text-center py-24 bg-gray-900 border border-gray-800 rounded-xl">
          <p className="text-gray-500 text-lg mb-4">
            You haven't placed any orders yet
          </p>
          <Link
            href="/products"
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block bg-gray-900 border border-gray-800 hover:border-orange-500 rounded-xl p-5 transition-colors group"
            >
              <div className="flex items-start justify-between gap-4 mb-4">

                {/* Order ID + Date */}
                <div>
                  <p className="text-white font-semibold group-hover:text-orange-400 transition-colors">
                    Order #{order.id}
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString("en-PH", {
                      year:  "numeric",
                      month: "long",
                      day:   "numeric",
                    })}
                  </p>
                </div>

                {/* Status + Total */}
                <div className="text-right shrink-0">
                  <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full mb-1 ${getStatusStyle(order.status)}`}>
                    {order.status}
                  </span>
                  <p className="text-white font-bold">
                    ${Number(order.total).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Product previews */}
              <div className="flex items-center gap-2">
                <p className="text-gray-500 text-sm">
                  {order.items.length}{" "}
                  {order.items.length === 1 ? "item" : "items"}:
                </p>
                <p className="text-gray-400 text-sm truncate">
                  {order.items
                    .map((i) => `${i.product.name} ×${i.quantity}`)
                    .join(", ")}
                </p>
              </div>

              <p className="text-orange-400 text-xs mt-3 group-hover:text-orange-300 transition-colors">
                View details →
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}