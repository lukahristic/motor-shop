// app/api/ymm/years/route.ts

import { ymmData } from "@/lib/mock-data"
import { successResponse } from "@/lib/api-response"

export async function GET() {
  const years = Object.keys(ymmData).sort((a, b) => Number(b) - Number(a))
  return successResponse(years)
}