// app/api/auth/me/route.ts
// GET /api/auth/me
// Returns the currently logged-in user based on their cookie

import { cookies }              from "next/headers"
import { verifyToken }          from "@/lib/auth"
import { prisma }               from "@/lib/prisma"
import { successResponse, ApiErrors } from "@/lib/api-response"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token       = cookieStore.get("auth-token")?.value

    if (!token) return ApiErrors.unauthorized()

    // Verify and decode the JWT
    const payload = verifyToken(token)

    // Get fresh user data from DB
    // (role might have changed since token was issued)
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id:    true,
        name:  true,
        email: true,
        role:  true,
        // password is NOT selected — never returned
      },
    })

    if (!user) return ApiErrors.unauthorized()

    return successResponse(user)
  } catch (error) {
    // verifyToken throws if token is expired or tampered
    return ApiErrors.unauthorized()
  }
}