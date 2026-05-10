// app/api/admin/ymm/models/route.ts
// POST /api/admin/ymm/models → create a model under a make

import { prisma }                     from "@/lib/prisma"
import { createdResponse, ApiErrors } from "@/lib/api-response"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, makeId } = body

    if (!name || !makeId) {
      return ApiErrors.badRequest("Missing required fields: name, makeId")
    }

    // Check for duplicate model under same make
    const existing = await prisma.model.findFirst({
      where: { name, makeId: Number(makeId) },
    })

    if (existing) {
      return ApiErrors.badRequest(`${name} already exists for that make`)
    }

    const model = await prisma.model.create({
      data: {
        name,
        makeId: Number(makeId),
      },
    })

    return createdResponse(model, `${model.name} created`)
  } catch (error) {
    return ApiErrors.serverError(error)
  }
}