// app/api/admin/products/[id]/compatibility/[compatibilityId]/route.ts
// DELETE → remove a specific compatibility record

import { prisma }                     from "@/lib/prisma"
import { successResponse, ApiErrors } from "@/lib/api-response"

interface RouteParams {
  params: Promise<{ id: string; compatibilityId: string }>
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { compatibilityId } = await params

    const deleted = await prisma.productCompatibility.delete({
      where: { id: Number(compatibilityId) },
    })

    return successResponse(deleted, "Vehicle compatibility removed")
  } catch (error) {
    return ApiErrors.notFound("Compatibility record")
  }
}