// app/api/ymm/makes/route.ts
// GET /api/ymm/makes?year=2022 → returns makes for that year

import { NextResponse } from "next/server"
import { ymmData } from "@/lib/mock-data"

export async function GET(request: Request) {
  // Read the ?year= query parameter from the URL
  const { searchParams } = new URL(request.url)
  const year = searchParams.get("year")

  if (!year) {
    return NextResponse.json(
      { success: false, error: "Missing required query param: year" },
      { status: 400 }
    )
  }

  if (!ymmData[year]) {
    return NextResponse.json(
      { success: false, error: "No data found for that year" },
      { status: 404 }
    )
  }

  const makes = Object.keys(ymmData[year])

  return NextResponse.json(
    { success: true, data: makes },
    { status: 200 }
  )
}