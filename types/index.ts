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

// Serialized version of the Prisma Product — safe to pass to Client Components
// Converts Decimal → number, Date → string
export interface SerializedProduct {
  id:          number
  name:        string
  slug:        string
  description: string | null
  price:       number           // ← plain number, not Prisma Decimal
  inStock:     boolean
  imageUrl:    string | null
  category:    string
  createdAt:   string           // ← plain string, not Date object
  updatedAt:   string
}

export interface SerializedModel {
  id:     number
  name:   string
  makeId: number
}

export interface SerializedMake {
  id:     number
  name:   string
  yearId: number
  models: SerializedModel[]
}

export interface SerializedYear {
  id:    number
  year:  number
  makes: SerializedMake[]
}

export interface VehicleCompatibility {
  compatibilityId: number
  modelId:         number
  model:           string
  make:            string
  year:            number
}