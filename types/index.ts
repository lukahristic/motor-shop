// types/index.ts
// This is where we define TypeScript interfaces shared across the whole app.
// As the project grows, all our data shapes live here.

export interface Product {
    id: number
    name: string
    slug: string           // URL-friendly name e.g. "oil-filter-premium"
    description?: string   // optional
    price: number
    imageUrl?: string      // optional
    inStock: boolean
    category: string
    compatibleYear?: number
    compatibleMake?: string
    compatibleModel?: string
  }
  
  export interface Vehicle {
    year: number
    make: string           // e.g. "Toyota"
    model: string          // e.g. "Camry"
  }
  
  export interface User {
    id: number
    name: string
    email: string
    role: "admin" | "user" // only these two values are allowed — TypeScript enforces this
  }