// lib/get-user.ts
// Helper to read the user injected by middleware into request headers.
// Use this in any protected route handler instead of re-verifying the token.

import { JWTPayload } from "@/lib/auth"

export function getUserFromHeaders(request: Request): JWTPayload | null {
  const id    = request.headers.get("x-user-id")
  const email = request.headers.get("x-user-email")
  const role  = request.headers.get("x-user-role") as "USER" | "ADMIN" | null

  if (!id || !email || !role) return null

  return { id: Number(id), email, role }
}