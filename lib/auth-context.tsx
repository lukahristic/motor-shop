// lib/auth-context.tsx
// Global authentication state shared across the entire app.
// Wrap the app with <AuthProvider> and use useAuth() anywhere.

"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react"

// Shape of the user object stored in context
interface AuthUser {
  id:    number
  name:  string
  email: string
  role:  "USER" | "ADMIN"
}

// Shape of the entire context value
interface AuthContextValue {
  user:    AuthUser | null  // null = not logged in
  loading: boolean          // true while checking auth status
  login:   (email: string, password: string) => Promise<void>
  logout:  () => Promise<void>
}

// Create the context with a default value
const AuthContext = createContext<AuthContextValue | null>(null)

// ── AuthProvider ──────────────────────────────────────────
// Wraps the app — manages auth state globally

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  // On mount: check if user is already logged in
  // (they might have a valid cookie from a previous session)
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me")
        if (res.ok) {
          const json = await res.json()
          setUser(json.data)
        }
      } catch {
        // Not logged in — that's fine
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, []) 

  // ── Login ───────────────────────────────────────────────
  async function login(email: string, password: string) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const json = await res.json()

    if (!res.ok) {
      // Throw the error message so the login form can display it
      throw new Error(json.error || "Login failed")
    }

    setUser(json.data.user)
  }

  // ── Logout ──────────────────────────────────────────────
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// ── useAuth hook ──────────────────────────────────────────
// Call this in any component to access auth state  
// Throws if used outside of AuthProvider

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider")
  }
  return context
}