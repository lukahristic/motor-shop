// app/api/ymm/models-with-ids/route.ts
// GET /api/ymm/models-with-ids?year=2022&make=Toyota
// Returns models with their database IDs — needed for compatibility linking

import { prisma }                     from "@/lib/prisma"
import { successResponse, ApiErrors } from "@/lib/api-response"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const year = searchParams.get("year")
  const make = searchParams.get("make")

  if (!year || !make) {
    return ApiErrors.badRequest("Missing required query params: year, make")
  }

  const makeRecord = await prisma.make.findFirst({
    where: {
      name: make,
      year: { year: Number(year) },
    },
    include: {
      models: {
        select: { id: true, name: true }, // only return id and name
        orderBy: { name: "asc" },
      },
    },
  })

  if (!makeRecord) return ApiErrors.notFound("Make")

  return successResponse(makeRecord.models)
}