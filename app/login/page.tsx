// app/login/page.tsx
"use client"

import { useState }      from "react"
import { useRouter }     from "next/navigation"
import Link              from "next/link"
import { useAuth }       from "@/lib/auth-context"
import FormInput         from "@/components/ui/FormInput"
import PasswordToggle    from "@/components/ui/PasswordToggle"

export default function LoginPage() {
  const router    = useRouter()
  const { login } = useAuth()

  // Form values
  const [email,      setEmail]      = useState("")
  const [password,   setPassword]   = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  // UI state
  const [showPassword, setShowPassword] = useState(false)
  const [error,        setError]        = useState("")
  const [loading,      setLoading]      = useState(false)

  // Field-level errors
  const [emailError,    setEmailError]    = useState("")
  const [passwordError, setPasswordError] = useState("")

  // Validate a single field on blur (when user leaves the field)
  function validateEmail(val: string) {
    if (!val) {
      setEmailError("Email is required")
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(val)) {
      setEmailError("Enter a valid email address")
      return false
    }
    setEmailError("")
    return true
  }

  function validatePassword(val: string) {
    if (!val) {
      setPasswordError("Password is required")
      return false
    }
    setPasswordError("")
    return true
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    // Validate all fields before submitting
    const emailOk    = validateEmail(email)
    const passwordOk = validatePassword(password)
    if (!emailOk || !passwordOk) return

    setLoading(true)

    try {
      await login(email, password)
      router.push("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-gray-400">Sign in to your MotorShop account</p>
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8">

          {/* Server error */}
          {error && (
            <div className="mb-6 px-4 py-3 bg-red-900/40 border border-red-700 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <FormInput
              label="Email address"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => validateEmail(email)}
              placeholder="john@example.com"
              error={emailError}
              required
              autoComplete="email"
            />

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-gray-400 text-sm">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-orange-400 hover:text-orange-300 text-xs transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <FormInput
                label=""
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => validatePassword(password)}
                placeholder="••••••••"
                error={passwordError}
                required
                autoComplete="current-password"
                rightSlot={
                  <PasswordToggle
                    show={showPassword}
                    onToggle={() => setShowPassword((v) => !v)}
                  />
                }
              />
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-orange-500 cursor-pointer"
              />
              <label
                htmlFor="rememberMe"
                className="text-gray-400 text-sm cursor-pointer select-none"
              >
                Remember me
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Signing in...
                </span>
              ) : "Sign in"}
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