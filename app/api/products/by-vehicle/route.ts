// app/api/products/by-vehicle/route.ts
// GET /api/products/by-vehicle?year=2022&make=Toyota&model=Camry
// Returns only products compatible with the specified vehicle

import { successResponse, ApiErrors } from "@/lib/api-response"
import { getProductsByVehicle } from "@/lib/products-data"

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

  const result = await getProductsByVehicle({ year, make, model })

  if (!result.vehicleFound) {
    return ApiErrors.notFound("Vehicle")
  }

  const { products } = result

  return successResponse(
    products,
    `${products.length} parts found for ${year} ${make} ${model}`
  )
}