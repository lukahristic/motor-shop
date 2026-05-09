// app/admin/products/[id]/edit/page.tsx
import { prisma }   from "@/lib/prisma"
import { notFound } from "next/navigation"
import EditProductForm from "@/components/admin/EditProductForm"
import { SerializedProduct } from "@/types"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params

  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
  })

  if (!product) notFound()

  // ── Serialize before passing to Client Component ──────
  // Convert all non-plain types to plain JS values
  const serialized: SerializedProduct = {
    id:          product.id,
    name:        product.name,
    slug:        product.slug,
    description: product.description,
    price:       Number(product.price),      // Decimal → number
    inStock:     product.inStock,
    imageUrl:    product.imageUrl,
    category:    product.category,
    createdAt:   product.createdAt.toISOString(), // Date → string
    updatedAt:   product.updatedAt.toISOString(), // Date → string
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Edit Product</h1>
      <EditProductForm product={serialized} />
    </div>
  )
}