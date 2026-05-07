// app/api/products/by-vehicle/route.ts
// GET /api/products/by-vehicle?year=2022&make=Toyota&model=Camry
// Returns only products compatible with the specified vehicle

import { prisma } from "@/lib/prisma"
import { successResponse, ApiErrors } from "@/lib/api-response"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const year  = searchParams.get("year")
  const make  = searchParams.get("make")
  const model = searchParams.get("model")

  // All three are required for a vehicle lookup
  if (!year || !make || !model) {
    return ApiErrors.badRequest(
      "Missing required query params: year, make, model"
    )
  }

  // Find the specific model record in the database
  // We navigate: year → make → model
  const modelRecord = await prisma.model.findFirst({
    where: {
      name: model,
      make: {
        name: make,
        year: { year: Number(year) },
      },
    },
  })

  if (!modelRecord) {
    return ApiErrors.notFound("Vehicle")
  }

  // Find all products compatible with this model
  // Through the ProductCompatibility join table
  const compatibilities = await prisma.productCompatibility.findMany({
    where: { modelId: modelRecord.id },
    include: {
      product: true, // fetch the full product data
    },
  })

  // Extract just the products from the compatibility records
  const products = compatibilities.map((c) => c.product)

  return successResponse(
    products,
    `${products.length} parts found for ${year} ${make} ${model}`
  )
}