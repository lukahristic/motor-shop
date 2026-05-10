// app/api/admin/ymm/models/[id]/route.ts
// DELETE /api/admin/ymm/models/:id

import { prisma }                     from "@/lib/prisma"
import { successResponse, ApiErrors } from "@/lib/api-response"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params

    const model = await prisma.model.delete({
      where: { id: Number(id) },
    })

    return successResponse(model, "Model deleted")
  } catch (error) {
    return ApiErrors.notFound("Model")
  }
}