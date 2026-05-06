// app/api/ymm/makes/route.ts
import { prisma } from "@/lib/prisma"
import { successResponse, ApiErrors } from "@/lib/api-response"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const year = searchParams.get("year")

  if (!year) return ApiErrors.badRequest("Missing required query param: year")

  const yearRecord = await prisma.year.findUnique({
    where: { year: Number(year) },
    include: { makes: true },
  })

  if (!yearRecord) return ApiErrors.notFound("Year")

  return successResponse(yearRecord.makes.map((m) => m.name))
}