// app/api/products/route.ts
// Handles:
//   GET  /api/products   → return all products
//   POST /api/products   → create a new product

import { NextResponse } from "next/server"
import { mockProducts } from "@/lib/mock-data"
import { Product } from "@/types"

// In-memory store for now — Phase 4 replaces this with Prisma + PostgreSQL
let products = [...mockProducts]

// GET /api/products
// Returns all products as JSON
export async function GET() {
  return NextResponse.json(
    { success: true, data: products },
    { status: 200 }
  )
}

// POST /api/products
// Creates a new product from the request body
export async function POST(request: Request) {
  try {
    // Parse the JSON body sent by the client
    const body = await request.json()

    // Basic validation — check required fields exist
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: name, price, category" },
        { status: 400 }
      )
    }

    // Build the new product object
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

    // Add to our in-memory list
    products.push(newProduct)

    // Return 201 Created with the new product
    return NextResponse.json(
      { success: true, data: newProduct },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    )
  }
}