// types/index.ts

export interface Product {
  id:          number
  name:        string
  slug:        string
  description: string | null
  price:       number
  salePrice:   number | null   // ← new
  inStock:     boolean
  stockCount:  number | null   // ← new
  isNew:       boolean         // ← new
  imageUrl:    string | null
  category:    string
  subcategory: string | null
  brand:       string | null
  createdAt:   string
  updatedAt:   string
}

export interface SerializedProduct {
  id:          number
  name:        string
  slug:        string
  description: string | null
  price:       number
  salePrice:   number | null   // ← new
  inStock:     boolean
  stockCount:  number | null   // ← new
  isNew:       boolean         // ← new
  imageUrl:    string | null
  category:    string
  subcategory: string | null
  brand:       string | null
  createdAt:   string
  updatedAt:   string
}

export interface CartItem {
  productId: number
  name:      string
  price:     number
  imageUrl:  string | null
  slug:      string
  quantity:  number
}

export interface Cart {
  items:     CartItem[]
  total:     number
  itemCount: number
}

export interface VehicleCompatibility {
  compatibilityId: number
  modelId:         number
  model:           string
  make:            string
  year:            number
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

export interface Vehicle {
  year:  number
  make:  string
  model: string
}

export interface User {
  id:    number
  name:  string
  email: string
  role:  "ADMIN" | "USER"
}