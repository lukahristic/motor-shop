// app/api/auth/login/route.ts
// POST /api/auth/login
// Verifies credentials and returns a JWT token

import { prisma }                     from "@/lib/prisma"
import { verifyPassword, createToken } from "@/lib/auth"
import { successResponse, ApiErrors }  from "@/lib/api-response"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // ── Validation ───────────────────────────────────────
    if (!email || !password) {
      return ApiErrors.badRequest(
        "Missing required fields: email, password"
      )
    }

    // ── Find user by email ────────────────────────────────
    const user = await prisma.user.findUnique({
      where: { email },
    })

    // IMPORTANT: Use the same error for "not found" and "wrong password"
    // Never tell attackers which one failed — that leaks information
    if (!user) {
      return ApiErrors.badRequest("Invalid email or password")
    }

    // ── Verify password ───────────────────────────────────
    const passwordMatch = await verifyPassword(password, user.password)

    if (!passwordMatch) {
      return ApiErrors.badRequest("Invalid email or password")
    }

    // ── Create and return JWT ─────────────────────────────
    const token = createToken({
      id:    user.id,
      email: user.email,
      role:  user.role,
    })

    return successResponse(
      {
        token,
        user: {
          id:    user.id,
          name:  user.name,
          email: user.email,
          role:  user.role,
        },
      },
      "Login successful"
    )
  } catch (error) {
    return ApiErrors.serverError(error)
  }
}