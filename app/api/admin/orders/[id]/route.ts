// app/api/admin/orders/[id]/route.ts
// PATCH /api/admin/orders/:id
// Updates the status of an order — admin only

import { prisma }                     from "@/lib/prisma"
import { successResponse, ApiErrors } from "@/lib/api-response"

interface RouteParams {
  params: Promise<{ id: string }>
}

const VALID_STATUSES = [
  "PENDING",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
]

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id }   = await params
    const body     = await request.json()
    const { status } = body

    if (!status || !VALID_STATUSES.includes(status)) {
      return ApiErrors.badRequest(
        `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`
      )
    }

    const order = await prisma.order.update({
      where: { id: Number(id) },
      data:  { status },
    })

    return successResponse(order, `Order status updated to ${status}`)
  } catch (error) {
    return ApiErrors.notFound("Order")
  }
}