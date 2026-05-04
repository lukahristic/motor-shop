// app/api/ymm/models/route.ts

import { ymmData } from "@/lib/mock-data"
import { successResponse, ApiErrors } from "@/lib/api-response"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const year = searchParams.get("year")
  const make = searchParams.get("make")

  if (!year || !make) {
    return ApiErrors.badRequest("Missing required query params: year, make")
  }

  if (!ymmData[year]?.[make]) return ApiErrors.notFound("Make")

  const models = ymmData[year][make]
  return successResponse(models)
}