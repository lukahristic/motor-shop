// prisma/seed.ts
// Seeds the database with initial data.
// Run with: npx prisma db seed

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Clean existing data (order matters due to foreign keys)
  await prisma.productCompatibility.deleteMany()
  await prisma.product.deleteMany()
  await prisma.model.deleteMany()
  await prisma.make.deleteMany()
  await prisma.year.deleteMany()

  // Seed Products
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

  console.log("✅ Products seeded")

  // Seed YMM data
  const year2022 = await prisma.year.create({ data: { year: 2022 } })
  const year2023 = await prisma.year.create({ data: { year: 2023 } })

  // 2022 makes
  const toyota2022 = await prisma.make.create({
    data: { name: "Toyota", yearId: year2022.id },
  })
  const honda2022 = await prisma.make.create({
    data: { name: "Honda", yearId: year2022.id },
  })

  // 2022 Toyota models
  const camry2022 = await prisma.model.create({
    data: { name: "Camry", makeId: toyota2022.id },
  })
  const corolla2022 = await prisma.model.create({
    data: { name: "Corolla", makeId: toyota2022.id },
  })

  // 2023 makes
  const toyota2023 = await prisma.make.create({
    data: { name: "Toyota", yearId: year2023.id },
  })

  const camry2023 = await prisma.model.create({
    data: { name: "Camry", makeId: toyota2023.id },
  })

  console.log("✅ YMM data seeded")

  // Link oil filter to 2022 Toyota Camry and Corolla
  await prisma.productCompatibility.createMany({
    data: [
      { productId: oilFilter.id, modelId: camry2022.id },
      { productId: oilFilter.id, modelId: corolla2022.id },
      { productId: oilFilter.id, modelId: camry2023.id },
      { productId: brakePads.id, modelId: camry2022.id },
      { productId: sparkPlugs.id, modelId: corolla2022.id },
    ],
  })

  console.log("✅ Product compatibility seeded")
  console.log("🎉 Seeding complete!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })