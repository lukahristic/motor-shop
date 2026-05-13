// app/api/admin/discounts/route.ts
// GET  → list all products with their discount info
// POST → apply a bulk discount to a category or brand

import { prisma }                               from "@/lib/prisma"
import { successResponse, ApiErrors }           from "@/lib/api-response"

// GET /api/admin/discounts
// Returns all products with price and salePrice
export async function GET() {
  const products = await prisma.product.findMany({
    select: {
      id:         true,
      name:       true,
      category:   true,
      brand:      true,
      price:      true,
      salePrice:  true,
      inStock:    true,
      isNew:      true,
    },
    orderBy: { category: "asc" },
  })

  // Serialize Decimal → number
  const serialized = products.map((p) => ({
    ...p,
    price:     Number(p.price),
    salePrice: p.salePrice ? Number(p.salePrice) : null,
  }))

  return successResponse(serialized)
}

// POST /api/admin/discounts
// Body: { type: "category"|"brand"|"all", value: string, percent: number }
// Applies a percentage discount to matching products
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, value, percent } = body

    // Validate percent
    if (!percent || percent < 1 || percent > 90) {
      return ApiErrors.badRequest(
        "Discount percent must be between 1 and 90"
      )
    }

    // Build the where clause based on type
    let where: Record<string, unknown> = {}

    if (type === "category" && value) {
      where = { category: value }
    } else if (type === "brand" && value) {
      where = { brand: value }
    } else if (type === "all") {
      where = {} // apply to everything
    } else {
      return ApiErrors.badRequest(
        "Invalid type. Must be: category, brand, or all"
      )
    }

    // Fetch matching products
    const products = await prisma.product.findMany({
      where,
      select: { id: true, price: true },
    })

    if (products.length === 0) {
      return ApiErrors.badRequest("No products found matching that filter")
    }

    // Apply discount to each product
    // Calculate salePrice = price - (price * percent / 100)
    const updates = products.map((p) => {
      const original  = Number(p.price)
      const salePrice = parseFloat(
        (original - (original * percent) / 100).toFixed(2)
      )

      return prisma.product.update({
        where: { id: p.id },
        data:  { salePrice },
      })
    })

    // Run all updates in parallel
    await Promise.all(updates)

    return successResponse(
      { updatedCount: products.length },
      `${percent}% discount applied to ${products.length} products`
    )
  } catch (error) {
    return ApiErrors.serverError(error)
  }
}

// DELETE /api/admin/discounts
// Body: { type: "category"|"brand"|"all"|"single", value?: string, id?: number }
// Clears salePrice from matching products
export async function DELETE(request: Request) {
  try {
    const body  = await request.json()
    const { type, value, id } = body

    let where: Record<string, unknown> = {}

    if (type === "single" && id) {
      where = { id: Number(id) }
    } else if (type === "category" && value) {
      where = { category: value }
    } else if (type === "brand" && value) {
      where = { brand: value }
    } else if (type === "all") {
      where = { salePrice: { not: null } }
    } else {
      return ApiErrors.badRequest("Invalid type or missing value/id")
    }

    const result = await prisma.product.updateMany({
      where,
      data: { salePrice: null },
    })

    return successResponse(
      { updatedCount: result.count },
      `Discount cleared from ${result.count} products`
    )
  } catch (error) {
    return ApiErrors.serverError(error)
  }
}