// app/api/ymm/models/route.ts
// GET /api/ymm/models?year=2022&make=Toyota → returns models

import { NextResponse } from "next/server"
import { ymmData } from "@/lib/mock-data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const year = searchParams.get("year")
  const make = searchParams.get("make")

  if (!year || !make) {
    return NextResponse.json(
      { success: false, error: "Missing required query params: year, make" },
      { status: 400 }
    )
  }

  if (!ymmData[year]?.[make]) {
    return NextResponse.json(
      { success: false, error: "No data found for that year and make" },
      { status: 404 }
    )
  }

  const models = ymmData[year][make]

  return NextResponse.json(
    { success: true, data: models },
    { status: 200 }
  )
}