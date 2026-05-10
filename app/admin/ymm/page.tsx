// app/admin/ymm/page.tsx
// Server component — fetches all YMM data and passes to client

import { prisma }    from "@/lib/prisma"
import YMMManager   from "@/components/admin/YMMManager"
import { SerializedYear } from "@/types"

async function getYMMData(): Promise<SerializedYear[]> {
  const years = await prisma.year.findMany({
    orderBy: { year: "desc" },
    include: {
      makes: {
        include: { models: true },
      },
    },
  })

  // Serialize for client component
  return years.map((y) => ({
    id:    y.id,
    year:  y.year,
    makes: y.makes.map((m) => ({
      id:     m.id,
      name:   m.name,
      yearId: m.yearId,
      models: m.models.map((mo) => ({
        id:     mo.id,
        name:   mo.name,
        makeId: mo.makeId,
      })),
    })),
  }))
}

export default async function AdminYMMPage() {
  const years = await getYMMData()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">YMM Data</h1>
        <p className="text-gray-500 text-sm">
          Manage Years, Makes, and Models for vehicle compatibility
        </p>
      </div>
      <YMMManager initialYears={years} />
    </div>
  )
}