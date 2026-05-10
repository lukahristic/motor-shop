// app/api/admin/ymm/years/route.ts
// GET  /api/admin/ymm/years → list all years with makes and models
// POST /api/admin/ymm/years → create a new year

import { prisma }                               from "@/lib/prisma"
import { successResponse, createdResponse, ApiErrors } from "@/lib/api-response"

export async function GET() {
  const years = await prisma.year.findMany({
    orderBy: { year: "desc" },
    include: {
      makes: {
        include: {
          models: true,  // include models inside each make
        },
      },
    },
  })

  return successResponse(years)
}

export async function POST(request: Request) {
  try {
    const body       = await request.json()
    const yearNumber = Number(body.year)

    if (!yearNumber || yearNumber < 1900 || yearNumber > 2100) {
      return ApiErrors.badRequest("Invalid year — must be between 1900 and 2100")
    }

    // Check for duplicate
    const existing = await prisma.year.findUnique({
      where: { year: yearNumber },
    })

    if (existing) {
      return ApiErrors.badRequest(`Year ${yearNumber} already exists`)
    }

    const year = await prisma.year.create({
      data: { year: yearNumber },
    })

    return createdResponse(year, `Year ${yearNumber} created`)
  } catch (error) {
    return ApiErrors.serverError(error)
  }
}