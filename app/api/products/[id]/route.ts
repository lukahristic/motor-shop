// app/api/products/[id]/route.ts
import { prisma } from "@/lib/prisma"
import { successResponse, ApiErrors } from "@/lib/api-response"
import { getUserFromHeaders } from "@/lib/get-user"



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
  const user = getUserFromHeaders(request)
  if (!user) return ApiErrors.unauthorized()
  if (user.role !== "ADMIN") return ApiErrors.forbidden()

  try {
    const { id } = await params
    const body = await request.json()

    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name:        body.name,
        slug:        body.name?.toLowerCase().replace(/\s+/g, "-"),
        description: body.description ?? "",
        price:       Number(body.price),
        salePrice:   body.salePrice ? Number(body.salePrice) : null,
        stockCount:  body.stockCount ? Number(body.stockCount) : null,
        isNew:       body.isNew ?? false,
        inStock:     body.inStock ?? true,
        category:    body.category,
        subcategory: body.subcategory ?? null,
        brand:       body.brand ?? null,
        imageUrl:    body.imageUrl ?? "",
      },
    })

    return successResponse(product, "Product updated successfully")
  } catch (error) {
    return ApiErrors.notFound("Product")
  }
}
// DELETE /api/products/:id
export async function DELETE(request: Request, { params }: RouteParams) {
  const user = getUserFromHeaders(request)
  if (!user) return ApiErrors.unauthorized()

  // Only admins can delete products
  if (user.role !== "ADMIN") return ApiErrors.forbidden()

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