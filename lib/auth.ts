// lib/auth.ts
// Core authentication utilities used across the entire app.
// Kept in one place so auth logic is never duplicated.

import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT_SECRET   = process.env.JWT_SECRET!
const SALT_ROUNDS  = Number(process.env.BCRYPT_ROUNDS) || 10

// ── Password Utilities ────────────────────────────────────

// Hash a plain text password before storing in DB
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

// Compare a plain text attempt against a stored hash
// Returns true if they match, false if not
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// ── JWT Utilities ─────────────────────────────────────────

export interface JWTPayload {
  id:    number
  email: string
  role:  "USER" | "ADMIN"
}

// Create a signed JWT token — expires in 7 days
export function createToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
}

// Verify and decode a JWT token
// Returns the payload if valid, throws if expired or tampered
export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload
}

// Extract JWT from Authorization header
// Header format: "Bearer eyJhbGci..."
export function extractToken(authHeader?: string): string | null {
  if (!authHeader?.startsWith("Bearer ")) return null
  return authHeader.split(" ")[1]
}