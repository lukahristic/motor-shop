// app/api/auth/login/route.ts
import { prisma }                      from "@/lib/prisma"
import { verifyPassword, createToken } from "@/lib/auth"
import { successResponse, ApiErrors }  from "@/lib/api-response"
import { cookies }                     from "next/headers"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return ApiErrors.badRequest("Missing required fields: email, password")
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return ApiErrors.badRequest("Invalid email or password")
    }

    const passwordMatch = await verifyPassword(password, user.password)

    if (!passwordMatch) {
      return ApiErrors.badRequest("Invalid email or password")
    }

    const token = createToken({
      id:    user.id,
      email: user.email,
      role:  user.role,
    })

    

    // ── Set HTTP-only cookie ──────────────────────────────
    // The browser stores this automatically
    // JavaScript on the frontend CANNOT read this cookie
    const cookieStore = await cookies()
    cookieStore.set("auth-token", token, {
      httpOnly: true,       // JS cannot access
      secure:   process.env.NODE_ENV === "production", // HTTPS only in prod
      sameSite: "lax",      // CSRF protection
      maxAge:   60 * 60 * 24 * 7, // 7 days in seconds
      path:     "/",        // available on all routes
    })

    return successResponse(
      {
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