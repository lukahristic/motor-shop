// app/api/products/route.ts

import { NextResponse } from "next/server"
import { mockProducts } from "@/lib/mock-data"
import { successResponse, createdResponse, ApiErrors } from "@/lib/api-response"
import { Product } from "@/types"

let products = [...mockProducts]

// GET /api/products
export async function GET() {
  return successResponse(products, `${products.length} products found`)
}

// POST /api/products
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.price || !body.category) {
      return ApiErrors.badRequest(
        "Missing required fields: name, price, category"
      )
    }

    const newProduct: Product = {
      id: products.length + 1,
      name: body.name,
      slug: body.name.toLowerCase().replace(/\s+/g, "-"),
      description: body.description ?? "",
      price: Number(body.price),
      inStock: body.inStock ?? true,
      category: body.category,
      imageUrl: body.imageUrl ?? "",
    }

    products.push(newProduct)

    return createdResponse(newProduct, "Product created successfully")
  } catch (error) {
    return ApiErrors.badRequest("Invalid JSON in request body")
  }
}