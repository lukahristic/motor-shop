// app/api/products/[id]/route.ts
// Handles:
//   GET    /api/products/:id  → get one product
//   PUT    /api/products/:id  → update a product
//   DELETE /api/products/:id  → delete a product

import { NextResponse } from "next/server"
import { mockProducts } from "@/lib/mock-data"

let products = [...mockProducts]

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/products/:id
export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params
  const product = products.find((p) => p.id === Number(id))

  if (!product) {
    return NextResponse.json(
      { success: false, error: "Product not found" },
      { status: 404 }
    )
  }

  return NextResponse.json(
    { success: true, data: product },
    { status: 200 }
  )
}

// PUT /api/products/:id
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()

    const index = products.findIndex((p) => p.id === Number(id))

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      )
    }

    // Replace the product at that index with merged data
    products[index] = { ...products[index], ...body }

    return NextResponse.json(
      { success: true, data: products[index] },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    )
  }
}

// DELETE /api/products/:id
export async function DELETE(request: Request, { params }: RouteParams) {
  const { id } = await params
  const index = products.findIndex((p) => p.id === Number(id))

  if (index === -1) {
    return NextResponse.json(
      { success: false, error: "Product not found" },
      { status: 404 }
    )
  }

  // Remove the product from the array
  const deleted = products.splice(index, 1)[0]

  return NextResponse.json(
    { success: true, data: deleted },
    { status: 200 }
  )
}