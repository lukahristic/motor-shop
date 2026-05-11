// app/api/admin/products/[id]/compatibility/route.ts
// GET    → list all compatible vehicles for a product
// POST   → add a vehicle compatibility
// DELETE → remove a vehicle compatibility

import { prisma }                               from "@/lib/prisma"
import { successResponse, createdResponse, ApiErrors } from "@/lib/api-response"

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/admin/products/:id/compatibility
// Returns all vehicles this product is compatible with
export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params

  const compatibilities = await prisma.productCompatibility.findMany({
    where: { productId: Number(id) },
    include: {
      model: {
        include: {
          make: {
            include: {
              year: true, // get year → make → model in one query
            },
          },
        },
      },
    },
  })

  // Shape the data into something readable on the frontend
  const vehicles = compatibilities.map((c) => ({
    compatibilityId: c.id,
    modelId:         c.modelId,
    model:           c.model.name,
    make:            c.model.make.name,
    year:            c.model.make.year.year,
  }))

  return successResponse(vehicles)
}

// POST /api/admin/products/:id/compatibility
// Body: { modelId: number }
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id }  = await params
    const body    = await request.json()
    const modelId = Number(body.modelId)

    if (!modelId) {
      return ApiErrors.badRequest("Missing required field: modelId")
    }

    // Check if this compatibility already exists
    const existing = await prisma.productCompatibility.findUnique({
      where: {
        productId_modelId: {
          productId: Number(id),
          modelId,
        },
      },
    })

    if (existing) {
      return ApiErrors.badRequest(
        "This vehicle is already compatible with this product"
      )
    }

    const compatibility = await prisma.productCompatibility.create({
      data: {
        productId: Number(id),
        modelId,
      },
      include: {
        model: {
          include: {
            make: {
              include: { year: true },
            },
          },
        },
      },
    })

    return createdResponse(
      {
        compatibilityId: compatibility.id,
        modelId:         compatibility.modelId,
        model:           compatibility.model.name,
        make:            compatibility.model.make.name,
        year:            compatibility.model.make.year.year,
      },
      "Vehicle compatibility added"
    )
  } catch (error) {
    return ApiErrors.serverError(error)
  }
}