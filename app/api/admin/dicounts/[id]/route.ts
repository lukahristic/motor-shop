// app/api/admin/discounts/[id]/route.ts
// PATCH /api/admin/discounts/:id
// Updates salePrice for a single product

import { prisma }                     from "@/lib/prisma"
import { successResponse, ApiErrors } from "@/lib/api-response"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id }   = await params
    const body     = await request.json()
    const { salePrice } = body

    // null means clear the discount
    const parsedSalePrice = salePrice !== null && salePrice !== ""
      ? parseFloat(salePrice)
      : null

    // Validate sale price is less than regular price
    if (parsedSalePrice !== null) {
      const product = await prisma.product.findUnique({
        where:  { id: Number(id) },
        select: { price: true },
      })

      if (!product) return ApiErrors.notFound("Product")

      if (parsedSalePrice >= Number(product.price)) {
        return ApiErrors.badRequest(
          "Sale price must be less than the regular price"
        )
      }
    }

    const updated = await prisma.product.update({
      where: { id: Number(id) },
      data:  { salePrice: parsedSalePrice },
      select: {
        id:        true,
        name:      true,
        price:     true,
        salePrice: true,
      },
    })

    return successResponse(
      {
        ...updated,
        price:     Number(updated.price),
        salePrice: updated.salePrice ? Number(updated.salePrice) : null,
      },
      "Discount updated"
    )
  } catch (error) {
    return ApiErrors.serverError(error)
  }
}