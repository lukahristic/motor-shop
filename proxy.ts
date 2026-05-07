// middleware.ts
// Runs before EVERY request that matches the config below.
// Protects routes based on authentication and role.

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "@/lib/auth"

export function proxy(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value
  const { pathname } = request.nextUrl

  // ── Define protected route patterns ──────────────────
  const isAdminRoute  = pathname.startsWith("/admin") ||
                        pathname.startsWith("/api/admin")

  const isProtectedApi = (
    (pathname.startsWith("/api/products") &&
      request.method !== "GET") // only protect mutations
  )

  // ── Check if route needs protection ──────────────────
  if (!isAdminRoute && !isProtectedApi) {
    return NextResponse.next() // not protected — let through
  }

  // ── Verify the token ──────────────────────────────────
  if (!token) {
    // API request → return JSON error
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { success: false, error: "You must be logged in" },
        { status: 401 }
      )
    }
    // Page request → redirect to login
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    const payload = verifyToken(token)

    // ── Admin routes require ADMIN role ───────────────
    if (isAdminRoute && payload.role !== "ADMIN") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { success: false, error: "Admin access required" },
          { status: 403 }
        )
      }
      return NextResponse.redirect(new URL("/", request.url))
    }

    // ── Token is valid — attach user info to headers ──
    // Route handlers can read this without re-verifying the token
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-user-id",    String(payload.id))
    requestHeaders.set("x-user-email", payload.email)
    requestHeaders.set("x-user-role",  payload.role)

    return NextResponse.next({ request: { headers: requestHeaders } })
  } catch (error) {
    // Token is expired or invalid
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { success: false, error: "Session expired, please log in again" },
        { status: 401 }
      )
    }
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

// ── Which routes does this middleware apply to? ───────────
export const config = {
  matcher: [
    "/admin/:path*",        // all admin pages
    "/api/admin/:path*",    // all admin API routes
    "/api/products/:path*", // product mutations (POST/PUT/DELETE)
  ],
}