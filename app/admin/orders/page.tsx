// app/admin/orders/page.tsx
import { prisma }          from "@/lib/prisma"
import UpdateOrderStatus   from "@/components/admin/UpdateOrderStatus"

export const dynamic = "force-dynamic"

async function getAllOrders() {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user:  { select: { name: true, email: true } },
      items: { include: { product: { select: { name: true } } } },
    },
  })
}

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

export default async function AdminOrdersPage() {
  const orders = await getAllOrders()

  return (
    <div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Orders</h1>
        <p className="text-gray-500 text-sm">{orders.length} total orders</p>
      </div>

      {/* ── DESKTOP TABLE (hidden on mobile) ─────────────── */}
      <div className="hidden md:block bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              {["Order", "Customer", "Items", "Total", "Status", "Update"].map((h) => (
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
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-gray-800 last:border-0 hover:bg-gray-800/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <p className="text-white text-sm font-medium">#{order.id}</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString("en-PH", {
                      month: "short",
                      day:   "numeric",
                      year:  "numeric",
                    })}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-white text-sm">{order.user.name}</p>
                  <p className="text-gray-500 text-xs">{order.user.email}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-gray-400 text-xs max-w-[180px] truncate">
                    {order.items
                      .map((i) => `${i.product.name} ×${i.quantity}`)
                      .join(", ")}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <span className="text-white text-sm font-semibold">
                    ${Number(order.total).toFixed(2)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusStyle(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <UpdateOrderStatus
                    orderId={order.id}
                    currentStatus={order.status}
                  />
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-500 text-sm">
                  No orders yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── MOBILE CARDS (hidden on desktop) ─────────────── */}
      <div className="md:hidden space-y-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4"
          >
            {/* Top row — order ID + status */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="text-white font-semibold">#{order.id}</p>
                <p className="text-gray-500 text-xs mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString("en-PH", {
                    month: "short",
                    day:   "numeric",
                    year:  "numeric",
                  })}
                </p>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${getStatusStyle(order.status)}`}>
                {order.status}
              </span>
            </div>

            {/* Customer */}
            <div className="mb-2">
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
                Customer
              </p>
              <p className="text-white text-sm">{order.user.name}</p>
              <p className="text-gray-500 text-xs">{order.user.email}</p>
            </div>

            {/* Items */}
            <div className="mb-2">
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
                Items
              </p>
              <p className="text-gray-300 text-xs line-clamp-2">
                {order.items
                  .map((i) => `${i.product.name} ×${i.quantity}`)
                  .join(", ")}
              </p>
            </div>

            {/* Total + Update row */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-800 mt-3">
              <span className="text-white font-bold">
                ${Number(order.total).toFixed(2)}
              </span>
              <UpdateOrderStatus
                orderId={order.id}
                currentStatus={order.status}
              />
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="text-center py-12 text-gray-500 text-sm">
            No orders yet
          </div>
        )}
      </div>

    </div>
  )
}