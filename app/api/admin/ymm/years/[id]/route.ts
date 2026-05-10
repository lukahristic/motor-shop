// app/api/admin/ymm/years/[id]/route.ts
// DELETE /api/admin/ymm/years/:id

import { prisma }                        from "@/lib/prisma"
import { successResponse, ApiErrors }    from "@/lib/api-response"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params

    const year = await prisma.year.delete({
      where: { id: Number(id) },
    })

    return successResponse(year, `Year deleted`)
  } catch (error) {
    return ApiErrors.notFound("Year")
  }
}