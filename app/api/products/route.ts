// app/api/products/route.ts
import { prisma } from "@/lib/prisma"
import { successResponse, createdResponse, ApiErrors } from "@/lib/api-response"
import { getUserFromHeaders } from "@/lib/get-user"
import { getAllProductsForCatalog } from "@/lib/products-data"

// GET /api/products — fetch all products from the real database
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const category = searchParams.get("category") ?? undefined
  const subcategory = searchParams.get("subcategory") ?? undefined
  const brand = searchParams.get("brand") ?? undefined

  const products = await getAllProductsForCatalog({
    category,
    subcategory,
    brand,
  })

  return successResponse(products, `${products.length} products found`)
}


// POST /api/products — create a product in the real database
export async function POST(request: Request) {
  try {

    const user = getUserFromHeaders(request)

    if (!user) return ApiErrors.unauthorized()
    if (user.role !== "ADMIN") return ApiErrors.forbidden()
      
    const body = await request.json()

    if (!body.name || !body.price || !body.category) {
      return ApiErrors.badRequest(
        "Missing required fields: name, price, category"
      )
    }

    // app/api/products/route.ts — update POST
    const product = await prisma.product.create({
      data: {
        name:        body.name,
        slug:        body.name.toLowerCase().replace(/\s+/g, "-"),
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

    return createdResponse(product, "Product created successfully")
  } catch (error) {
    return ApiErrors.badRequest("Invalid request body")
  }
}