// app/api/products/[id]/route.ts

import { mockProducts } from "@/lib/mock-data"
import { successResponse, ApiErrors } from "@/lib/api-response"

let products = [...mockProducts]

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/products/:id
export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params
  const product = products.find((p) => p.id === Number(id))

  if (!product) return ApiErrors.notFound("Product")

  return successResponse(product)
}

// PUT /api/products/:id
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()
    const index = products.findIndex((p) => p.id === Number(id))

    if (index === -1) return ApiErrors.notFound("Product")

    products[index] = { ...products[index], ...body }

    return successResponse(products[index], "Product updated successfully")
  } catch (error) {
    return ApiErrors.badRequest("Invalid JSON in request body")
  }
}

// DELETE /api/products/:id
export async function DELETE(request: Request, { params }: RouteParams) {
  const { id } = await params
  const index = products.findIndex((p) => p.id === Number(id))

  if (index === -1) return ApiErrors.notFound("Product")

  const deleted = products.splice(index, 1)[0]

  return successResponse(deleted, "Product deleted successfully")
}