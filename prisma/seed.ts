// prisma/seed.ts
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Clean existing data
  await prisma.productCompatibility.deleteMany()
  await prisma.product.deleteMany()
  await prisma.model.deleteMany()
  await prisma.make.deleteMany()
  await prisma.year.deleteMany()

  // ── Products ─────────────────────────────────────────
  const oilFilter = await prisma.product.create({
    data: {
      name: "Premium Oil Filter",
      slug: "premium-oil-filter",
      description: "High-performance oil filter for extended engine life.",
      price: 12.99,
      inStock: true,
      category: "Engine",
    },
  })

  const brakePads = await prisma.product.create({
    data: {
      name: "Ceramic Brake Pads",
      slug: "ceramic-brake-pads",
      description: "Low-dust ceramic pads for smooth, quiet braking.",
      price: 49.99,
      inStock: true,
      category: "Brakes",
    },
  })

  const sparkPlugs = await prisma.product.create({
    data: {
      name: "Spark Plug Set (x4)",
      slug: "spark-plug-set",
      description: "Iridium-tipped spark plugs for better fuel efficiency.",
      price: 34.99,
      inStock: false,
      category: "Engine",
    },
  })

  const airFilter = await prisma.product.create({
    data: {
      name: "Air Filter",
      slug: "air-filter",
      description: "High-flow air filter for improved throttle response.",
      price: 19.99,
      inStock: true,
      category: "Engine",
    },
  })

  const shockAbsorber = await prisma.product.create({
    data: {
      name: "Shock Absorber Pair",
      slug: "shock-absorber-pair",
      description: "Heavy-duty shock absorbers for a smoother ride.",
      price: 129.99,
      inStock: true,
      category: "Suspension",
    },
  })

  console.log("✅ Products seeded")

  // ── YMM Data ──────────────────────────────────────────
  const ymmData = {
    2021: {
      Toyota: ["Camry", "Corolla", "RAV4"],
      Honda:  ["Civic", "Accord", "CR-V"],
      Ford:   ["Ranger", "Everest"],
    },
    2022: {
      Toyota: ["Camry", "Corolla", "RAV4", "GR86"],
      Honda:  ["Civic", "Accord", "CR-V", "BRV"],
      Ford:   ["Ranger", "Everest", "Mustang"],
      Nissan: ["Navara", "Terra", "Almera"],
    },
    2023: {
      Toyota:     ["Camry", "Corolla", "Vios", "Fortuner"],
      Honda:      ["Civic", "Accord", "CR-V"],
      Nissan:     ["Navara", "Terra", "Almera"],
      Mitsubishi: ["Strada", "Montero", "Xpander"],
    },
  }

  // Track created models for compatibility linking
  const createdModels: Record<string, number> = {}

  for (const [yearNum, makes] of Object.entries(ymmData)) {
    const year = await prisma.year.create({
      data: { year: Number(yearNum) },
    })

    for (const [makeName, models] of Object.entries(makes)) {
      const make = await prisma.make.create({
        data: { name: makeName, yearId: year.id },
      })

      for (const modelName of models) {
        const model = await prisma.model.create({
          data: { name: modelName, makeId: make.id },
        })
        // Store with a key like "2022-Toyota-Camry"
        createdModels[`${yearNum}-${makeName}-${modelName}`] = model.id
      }
    }
  }

  console.log("✅ YMM data seeded")

  // ── Product Compatibility ─────────────────────────────
  const compatibilities = [
    { product: oilFilter,     vehicles: ["2022-Toyota-Camry", "2022-Toyota-Corolla", "2023-Toyota-Camry"] },
    { product: brakePads,     vehicles: ["2022-Toyota-Camry", "2022-Honda-Civic", "2023-Honda-Civic"] },
    { product: sparkPlugs,    vehicles: ["2022-Toyota-Corolla", "2021-Toyota-Corolla"] },
    { product: airFilter,     vehicles: ["2022-Ford-Ranger", "2023-Mitsubishi-Strada", "2021-Ford-Ranger", "2023-Mitsubishi-Xpander"] },
    { product: shockAbsorber, vehicles: ["2022-Nissan-Navara", "2023-Nissan-Navara", "2021-Honda-CR-V"] },
  ]

  for (const { product, vehicles } of compatibilities) {
    for (const vehicleKey of vehicles) {
      const modelId = createdModels[vehicleKey]
      if (!modelId) continue
      await prisma.productCompatibility.create({
        data: { productId: product.id, modelId },
      })
    }
  }

  console.log("✅ Product compatibility seeded")
  console.log("🎉 Done!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })