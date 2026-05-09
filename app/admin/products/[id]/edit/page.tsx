// app/admin/products/[id]/edit/page.tsx
// Pre-fills the form with existing product data
// Submits a PUT request to update it

import { prisma }   from "@/lib/prisma"
import { notFound } from "next/navigation"
import EditProductForm from "@/components/admin/EditProductForm"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params

  // Fetch the existing product on the server
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
  })

  // If product doesn't exist, show 404
  if (!product) notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Edit Product</h1>
      {/* Pass product data to the client form component */}
      <EditProductForm product={product} />
    </div>
  )
}