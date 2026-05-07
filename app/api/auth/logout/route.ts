// app/api/auth/logout/route.ts
// POST /api/auth/logout
// Clears the auth cookie — user is logged out

import { cookies }          from "next/headers"
import { successResponse }  from "@/lib/api-response"

export async function POST() {
  const cookieStore = await cookies()

  // Delete the cookie by setting maxAge to 0
  cookieStore.set("auth-token", "", {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge:   0,    // expires immediately
    path:     "/",
  })

  return successResponse(null, "Logged out successfully")
}