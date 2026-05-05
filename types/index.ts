// types/index.ts

export interface Product {
  id: number
  name: string
  slug: string
  description?: string | null
  price: number | string    // Prisma Decimal serializes as string in JSON
  inStock: boolean
  imageUrl?: string | null
  category: string
  createdAt?: string
  updatedAt?: string
  compatibleYear?: number
  compatibleMake?: string
  compatibleModel?: string
}

export interface Vehicle {
  year: number
  make: string
  model: string
}

export interface User {
  id: number
  name: string
  email: string
  role: "ADMIN" | "USER"
}