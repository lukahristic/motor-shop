// app/admin/products/[id]/edit/page.tsx
import { prisma }             from "@/lib/prisma"
import { notFound }           from "next/navigation"
import EditProductForm        from "@/components/admin/EditProductForm"
import CompatibilityManager   from "@/components/admin/CompatibilityManager"
import { SerializedProduct }  from "@/types"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params

  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
  })

  if (!product) notFound()

  const serialized: SerializedProduct = {
    id:          product.id,
    name:        product.name,
    slug:        product.slug,
    description: product.description,
    price:       Number(product.price),
    inStock:     product.inStock,
    imageUrl:    product.imageUrl,
    category:    product.category,
    subcategory: product.subcategory ?? "",
    brand:       product.brand ?? "",
    createdAt:   product.createdAt.toISOString(),
    updatedAt:   product.updatedAt.toISOString(),
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Edit Product</h1>

      {/* Product form — name, price, category etc */}
      <EditProductForm product={serialized} />

      {/* Compatibility manager — below the form */}
      <CompatibilityManager productId={product.id} />

    </div>
  )
}