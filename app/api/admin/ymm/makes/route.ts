// app/api/admin/ymm/makes/route.ts
// POST /api/admin/ymm/makes → create a make under a year

import { prisma }                               from "@/lib/prisma"
import { createdResponse, ApiErrors }           from "@/lib/api-response"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, yearId } = body

    if (!name || !yearId) {
      return ApiErrors.badRequest("Missing required fields: name, yearId")
    }

    // Check for duplicate make under same year
    const existing = await prisma.make.findFirst({
      where: { name, yearId: Number(yearId) },
    })

    if (existing) {
      return ApiErrors.badRequest(`${name} already exists for that year`)
    }

    const make = await prisma.make.create({
      data: {
        name,
        yearId: Number(yearId),
      },
    })

    return createdResponse(make, `${name} created`)
  } catch (error) {
    return ApiErrors.serverError(error)
  }
}