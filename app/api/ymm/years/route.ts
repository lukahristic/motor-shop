// app/api/ymm/years/route.ts
// GET /api/ymm/years → returns all available years

import { NextResponse } from "next/server"
import { ymmData } from "@/lib/mock-data"

export async function GET() {
  const years = Object.keys(ymmData).sort((a, b) => Number(b) - Number(a))

  return NextResponse.json(
    { success: true, data: years },
    { status: 200 }
  )
}