// app/login/page.tsx
"use client"

import { useState }      from "react"
import { useRouter }     from "next/navigation"
import Link              from "next/link"
import { useAuth }       from "@/lib/auth-context"

export default function LoginPage() {
  const router        = useRouter()
  const { login }     = useAuth()

  const [email,    setEmail]    = useState("")
  const [password, setPassword] = useState("")
  const [error,    setError]    = useState("")
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()  // prevent default browser form submission
    setError("")
    setLoading(true)

    try {
      await login(email, password)
      router.push("/")  // redirect to homepage after login
    } catch (err) {
      // Display the error from the API
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-gray-400">Sign in to your MotorShop account</p>
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">

          {/* Error message */}
          {error && (
            <div className="mb-6 px-4 py-3 bg-red-900/40 border border-red-700 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="john@example.com"
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

          </form>

          {/* Register link */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-orange-400 hover:text-orange-300 transition-colors"
            >
              Create one
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}