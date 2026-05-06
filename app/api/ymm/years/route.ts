// app/api/ymm/years/route.ts
import { prisma } from "@/lib/prisma"
import { successResponse } from "@/lib/api-response"

export async function GET() {
  const years = await prisma.year.findMany({
    orderBy: { year: "desc" },
  })

  // Return just the year numbers, not the full DB objects
  return successResponse(years.map((y) => y.year))
}