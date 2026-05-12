// lib/products-data.ts
// Shared DB access for /api/products, /api/products/by-vehicle, and RSC pages.
// Avoids server-side fetch to the public URL (breaks in Docker: localhost/IPv6).

import { prisma } from "@/lib/prisma"
import type { Product } from "@/types"
import type { Product as PrismaProduct } from "@prisma/client"

function toProduct(p: PrismaProduct): Product {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: Number(p.price),
    salePrice: p.salePrice !== null ? Number(p.salePrice) : null,
    inStock: p.inStock,
    stockCount: p.stockCount,
    isNew: p.isNew,
    imageUrl: p.imageUrl,
    category: p.category,
    subcategory: p.subcategory,
    brand: p.brand,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }
}

/** Same dataset as GET /api/products */
/** Same dataset as GET /api/products */
export async function getAllProductsForCatalog(filters?: {
  category?: string
  subcategory?: string
  brand?: string
}): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: {
      ...(filters?.category
        ? { category: filters.category }
        : {}),

      ...(filters?.subcategory
        ? { subcategory: filters.subcategory }
        : {}),

      ...(filters?.brand
        ? { brand: filters.brand }
        : {}),
    },

    orderBy: { createdAt: "desc" },
  })

  return rows.map(toProduct)
}


/** Same dataset as GET /api/products/by-vehicle */
export async function getProductsByVehicle(params: {
  year: string
  make: string
  model: string
}): Promise<{ vehicleFound: false } | { vehicleFound: true; products: Product[] }> {
  const { year, make, model } = params

  const modelRecord = await prisma.model.findFirst({
    where: {
      name: model,
      make: {
        name: make,
        year: { year: Number(year) },
      },
    },
  })

  if (!modelRecord) return { vehicleFound: false }

  const compatibilities = await prisma.productCompatibility.findMany({
    where: { modelId: modelRecord.id },
    include: { product: true },
  })

  return {
    vehicleFound: true,
    products: compatibilities.map((c) => toProduct(c.product)),
  }
}

type ProductDetailBySlug = Product & {
  compatibleYear?: number
  compatibleMake?: string
  compatibleModel?: string
}

/** Single product by slug for /products/[slug]; adds first YMM from compatibilities when present */
export async function getProductDetailBySlug(
  slug: string
): Promise<ProductDetailBySlug | null> {
  const row = await prisma.product.findUnique({
    where: { slug },
    include: {
      compatibilities: {
        include: {
          model: {
            include: {
              make: {
                include: { year: true },
              },
            },
          },
        },
      },
    },
  })

  if (!row) return null

  const base = toProduct(row)
  const first = row.compatibilities[0]
  if (first) {
    return {
      ...base,
      compatibleYear: first.model.make.year.year,
      compatibleMake: first.model.make.name,
      compatibleModel: first.model.name,
    }
  }
  return base
}
