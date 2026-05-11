// app/orders/[id]/page.tsx
// Shows full detail of a single order

import { prisma }      from "@/lib/prisma"
import { cookies }     from "next/headers"
import { verifyToken } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import Image           from "next/image"
import Link            from "next/link"
import { FALLBACK_IMAGE } from "@/lib/constants"

export const dynamic = "force-dynamic"

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

function getStatusDescription(status: string) {
  switch (status) {
    case "PENDING":   return "Your order has been received and is awaiting payment confirmation."
    case "PAID":      return "Payment confirmed. Your order is being prepared."
    case "SHIPPED":   return "Your order is on its way."
    case "DELIVERED": return "Your order has been delivered."
    case "CANCELLED": return "This order was cancelled."
    default:          return ""
  }
}

interface PageProps {
  params: Promise<{ id: string }>
}

function getImageSrc(imageUrl?: string | null): string {
    if (!imageUrl || imageUrl.trim() === "") return FALLBACK_IMAGE
    return imageUrl
  }

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params

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

  // Fetch the order
  const order = await prisma.order.findUnique({
    where: { id: Number(id) },
    include: {
      items: {
        include: {
          product: {
            select: {
              name:     true,
              slug:     true,
              imageUrl: true,
              category: true,
            },
          },
        },
      },
    },
  })

  // 404 if not found
  if (!order) notFound()

  // Security — users can only see their own orders
  if (order.userId !== userId) notFound()

  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-PH", {
    year:    "numeric",
    month:   "long",
    day:     "numeric",
    hour:    "2-digit",
    minute:  "2-digit",
  })

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">

      {/* Back link */}
      <Link
        href="/orders"
        className="text-orange-400 hover:text-orange-300 text-sm mb-8 inline-block transition-colors"
      >
        ← Back to Orders
      </Link>

      {/* Order Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Order #{order.id}
          </h1>
          <p className="text-gray-500 text-sm mt-1">{formattedDate}</p>
        </div>
        <span className={`text-sm font-medium px-3 py-1.5 rounded-full shrink-0 ${getStatusStyle(order.status)}`}>
          {order.status}
        </span>
      </div>

      {/* Status description */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
        <p className="text-gray-400 text-sm">
          {getStatusDescription(order.status)}
        </p>
      </div>

      {/* Order Items */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-6">
        <div className="px-5 py-3 border-b border-gray-800">
          <p className="text-gray-400 text-sm font-medium">
            Items ({order.items.length})
          </p>
        </div>

        <div className="divide-y divide-gray-800">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 px-5 py-4">

              {/* Product image */}
              <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-gray-800">
                <Image
                  src={getImageSrc(item.product.imageUrl)}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Product info */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.product.slug}`}
                  className="text-white text-sm font-medium hover:text-orange-400 transition-colors line-clamp-1"
                >
                  {item.product.name}
                </Link>
                <p className="text-gray-500 text-xs mt-0.5">
                  {item.product.category}
                </p>
              </div>

              {/* Quantity + Price */}
              <div className="text-right shrink-0">
                <p className="text-gray-400 text-xs mb-0.5">
                  ×{item.quantity} @ ${Number(item.price).toFixed(2)}
                </p>
                <p className="text-white font-semibold text-sm">
                  ${(Number(item.price) * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
        <h2 className="text-white font-semibold mb-4">Order Summary</h2>

        <div className="space-y-2 mb-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-400 truncate mr-4">
                {item.product.name} ×{item.quantity}
              </span>
              <span className="text-white shrink-0">
                ${(Number(item.price) * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 font-medium">Total</span>
            <span className="text-white font-bold text-xl">
              ${Number(order.total).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Stripe Payment ID (for support) */}
      {order.stripePaymentId && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-white font-semibold mb-2">Payment Reference</h2>
          <p className="text-gray-500 text-xs font-mono break-all">
            {order.stripePaymentId}
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Keep this reference number for any payment disputes.
          </p>
        </div>
      )}

    </div>
  )
}