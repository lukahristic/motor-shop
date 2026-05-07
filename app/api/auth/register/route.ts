// app/api/auth/register/route.ts
// POST /api/auth/register
// Creates a new user account with a hashed password

import { prisma }                          from "@/lib/prisma"
import { hashPassword, createToken }       from "@/lib/auth"
import { createdResponse, ApiErrors }      from "@/lib/api-response"
import { cookies } from "next/headers"


export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // ── Validation ──────────────────────────────────────
    if (!name || !email || !password) {
      return ApiErrors.badRequest(
        "Missing required fields: name, email, password"
      )
    }

    if (password.length < 8) {
      return ApiErrors.badRequest(
        "Password must be at least 8 characters"
      )
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return ApiErrors.badRequest("Invalid email format")
    }

    // ── Check for duplicate email ────────────────────────
    const existing = await prisma.user.findUnique({
      where: { email },
    })

    if (existing) {
      return ApiErrors.badRequest(
        "An account with this email already exists"
      )
    }

    // ── Hash password + create user ──────────────────────
    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword, // never store plain text
        role: "USER",
      },
    })

    // ── Create JWT token ─────────────────────────────────
    const token = createToken({
      id:    user.id,
      email: user.email,
      role:  user.role,
    })

    const cookieStore = await cookies()
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge:   60 * 60 * 24 * 7,
      path:     "/",
    })

    // Return token + safe user data (never return the password)
    return createdResponse(
      {
        token,
        user: {
          id:    user.id,
          name:  user.name,
          email: user.email,
          role:  user.role,
        },
      },
      "Account created successfully"
    )
  } catch (error) {
    return ApiErrors.serverError(error)
  }
}