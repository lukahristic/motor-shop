// app/api/ymm/makes/route.ts

import { ymmData } from "@/lib/mock-data"
import { successResponse, ApiErrors } from "@/lib/api-response"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const year = searchParams.get("year")

  if (!year) return ApiErrors.badRequest("Missing required query param: year")
  if (!ymmData[year]) return ApiErrors.notFound("Year")

  const makes = Object.keys(ymmData[year])
  return successResponse(makes)
}