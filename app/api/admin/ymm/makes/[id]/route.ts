// app/api/admin/ymm/makes/[id]/route.ts
// DELETE /api/admin/ymm/makes/:id

import { prisma }                     from "@/lib/prisma"
import { successResponse, ApiErrors } from "@/lib/api-response"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params

    const make = await prisma.make.delete({
      where: { id: Number(id) },
    })

    return successResponse(make, "Make deleted")
  } catch (error) {
    return ApiErrors.notFound("Make")
  }
}