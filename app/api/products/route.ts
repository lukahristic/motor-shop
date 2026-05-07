// app/api/products/route.ts
import { prisma } from "@/lib/prisma"
import { successResponse, createdResponse, ApiErrors } from "@/lib/api-response"
import { getUserFromHeaders } from "@/lib/get-user"


// GET /api/products — fetch all products from the real database
export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  })

  return successResponse(products, `${products.length} products found`)
}

// POST /api/products — create a product in the real database
export async function POST(request: Request) {
  try {

    const user = getUserFromHeaders(request)

  if (!user) return ApiErrors.unauthorized()
    const body = await request.json()

    if (!body.name || !body.price || !body.category) {
      return ApiErrors.badRequest(
        "Missing required fields: name, price, category"
      )
    }

    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.name.toLowerCase().replace(/\s+/g, "-"),
        description: body.description ?? "",
        price: Number(body.price),
        inStock: body.inStock ?? true,
        category: body.category,
        imageUrl: body.imageUrl ?? "",
      },
    })

    return createdResponse(product, "Product created successfully")
  } catch (error) {
    return ApiErrors.badRequest("Invalid request body")
  }
}