// lib/mock-data.ts
// Fake data that mirrors exactly what our database will return later.
// In Phase 4, we replace this with real Prisma DB queries.

import { Product } from "@/types"

export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Premium Oil Filter",
    slug: "premium-oil-filter",
    description: "High-performance oil filter for extended engine life.",
    price: 12.99,
    inStock: true,
    category: "Engine",
    imageUrl: "https://placehold.co/400x300/1a1a1a/orange?text=Oil+Filter",
    compatibleYear: 2004,
    compatibleMake: "Honda",
    compatibleModel: "CBR600",
  },
  {
    id: 2,
    name: "Ceramic Brake Pads",
    slug: "ceramic-brake-pads",
    description: "Low-dust ceramic pads for smooth, quiet braking.",
    price: 49.99,
    inStock: true,
    category: "Brakes",
    imageUrl: "https://placehold.co/400x300/1a1a1a/orange?text=Brake+Pads",
  },
  {
    id: 3,
    name: "Spark Plug Set (x4)",
    slug: "spark-plug-set",
    description: "Iridium-tipped spark plugs for better fuel efficiency.",
    price: 34.99,
    inStock: false,
    category: "Engine",
    imageUrl: "https://placehold.co/400x300/1a1a1a/orange?text=Spark+Plugs",
  },
  {
    id: 4,
    name: "Air Filter",
    slug: "air-filter",
    description: "High-flow air filter for improved throttle response.",
    price: 19.99,
    inStock: true,
    category: "Engine",
    imageUrl: "https://placehold.co/400x300/1a1a1a/orange?text=Air+Filter",
  },
  {
    id: 5,
    name: "Shock Absorber Pair",
    slug: "shock-absorber-pair",
    description: "Heavy-duty shock absorbers for a smoother ride.",
    price: 129.99,
    inStock: true,
    category: "Suspension",
    imageUrl: "https://placehold.co/400x300/1a1a1a/orange?text=Shocks",
  },
  {
    id: 6,
    name: "Serpentine Belt",
    slug: "serpentine-belt",
    description: "OEM-spec replacement belt for all accessories.",
    price: 27.99,
    inStock: false,
    category: "Engine",
    imageUrl: "https://placehold.co/400x300/1a1a1a/orange?text=Belt",
  },
  {
    id: 7,
    name: "Crash Guard",
    slug: "crash-guard",
    description: "Heavy duty crash guard impact absorbers.",
    price: 127.99,
    inStock: false,
    category: "Pairings",
    imageUrl: "https://placehold.co/400x300/1a1a1a/orange?text=Crash+Guard",
  },
]

// lib/mock-data.ts — add below your existing mockProducts

// YMM data structure — Phase 4 this comes from the database
export const ymmData: Record<string, Record<string, string[]>> = {
  "2020": {
    Toyota: ["Camry", "Corolla", "RAV4", "Hilux"],
    Honda:  ["Civic", "Accord", "CR-V", "Jazz"],
    Ford:   ["Ranger", "Everest", "Mustang"],
  },
  "2021": {
    Toyota: ["Camry", "Corolla", "RAV4", "Fortuner"],
    Honda:  ["Civic", "Accord", "CR-V"],
    Ford:   ["Ranger", "Everest", "Bronco"],
    Nissan: ["Navara", "Terra", "Almera"],
  },
  "2022": {
    Toyota: ["Camry", "Corolla", "RAV4", "GR86"],
    Honda:  ["Civic", "Accord", "CR-V", "BRV"],
    Ford:   ["Ranger", "Everest", "Mustang"],
    Nissan: ["Navara", "Terra", "Almera", "Magnite"],
  },
  "2023": {
    Toyota: ["Camry", "Corolla", "RAV4", "Vios"],
    Honda:  ["Civic", "Accord", "CR-V", "BRV"],
    Nissan: ["Navara", "Terra", "Almera"],
    Mitsubishi: ["Strada", "Montero", "Xpander"],
  },
}