// app/api/products/[id]/route.ts
import { prisma } from "@/lib/prisma"
import { successResponse, ApiErrors } from "@/lib/api-response"

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/products/:id
export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params

  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
  })

  if (!product) return ApiErrors.notFound("Product")

  return successResponse(product)
}

// PUT /api/products/:id
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()

    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: body,
    })

    return successResponse(product, "Product updated successfully")
  } catch (error) {
    return ApiErrors.notFound("Product")
  }
}

// DELETE /api/products/:id
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params

    const product = await prisma.product.delete({
      where: { id: Number(id) },
    })

    return successResponse(product, "Product deleted successfully")
  } catch (error) {
    return ApiErrors.notFound("Product")
  }
}