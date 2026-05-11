// app/register/page.tsx
"use client"

import { useState }       from "react"
import { useRouter }      from "next/navigation"
import Link               from "next/link"
import FormInput          from "@/components/ui/FormInput"
import PasswordToggle     from "@/components/ui/PasswordToggle"
import PasswordStrength   from "@/components/ui/PasswordStrength"

export default function RegisterPage() {
  const router = useRouter()

  // Form values
  const [name,            setName]            = useState("")
  const [email,           setEmail]           = useState("")
  const [password,        setPassword]        = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // UI state
  const [showPassword,        setShowPassword]        = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error,               setError]               = useState("")
  const [loading,             setLoading]             = useState(false)

  // Field-level errors
  const [nameError,            setNameError]            = useState("")
  const [emailError,           setEmailError]           = useState("")
  const [passwordError,        setPasswordError]        = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")

  // ── Validators ────────────────────────────────────────
  function validateName(val: string) {
    if (!val.trim()) {
      setNameError("Full name is required")
      return false
    }
    if (val.trim().length < 2) {
      setNameError("Name must be at least 2 characters")
      return false
    }
    setNameError("")
    return true
  }

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
    if (val.length < 8) {
      setPasswordError("Password must be at least 8 characters")
      return false
    }
    setPasswordError("")
    // Also re-validate confirm if it was already touched
    if (confirmPassword) validateConfirmPassword(confirmPassword, val)
    return true
  }

  function validateConfirmPassword(val: string, pw = password) {
    if (!val) {
      setConfirmPasswordError("Please confirm your password")
      return false
    }
    if (val !== pw) {
      setConfirmPasswordError("Passwords do not match")
      return false
    }
    setConfirmPasswordError("")
    return true
  }

  // ── Submit ────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    // Validate everything before submitting
    const nameOk    = validateName(name)
    const emailOk   = validateEmail(email)
    const passwordOk = validatePassword(password)
    const confirmOk  = validateConfirmPassword(confirmPassword)

    if (!nameOk || !emailOk || !passwordOk || !confirmOk) return

    setLoading(true)

    try {
      const res = await fetch("/api/auth/register", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name, email, password }),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Registration failed")

      router.push("/login")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create account</h1>
          <p className="text-gray-400">Join MotorShop today</p>
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

            {/* Full name */}
            <FormInput
              label="Full name"
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => validateName(name)}
              placeholder="John Doe"
              error={nameError}
              required
              autoComplete="name"
            />

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
              <FormInput
                label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  // Live validate as user types
                  if (passwordError) validatePassword(e.target.value)
                }}
                onBlur={() => validatePassword(password)}
                placeholder="Min. 8 characters"
                error={passwordError}
                required
                autoComplete="new-password"
                rightSlot={
                  <PasswordToggle
                    show={showPassword}
                    onToggle={() => setShowPassword((v) => !v)}
                  />
                }
              />
              {/* Strength bar — only shows when typing */}
              <PasswordStrength password={password} />
            </div>

            {/* Confirm password */}
            <FormInput
              label="Confirm password"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                // Live validate match as user types
                if (confirmPasswordError) validateConfirmPassword(e.target.value)
              }}
              onBlur={() => validateConfirmPassword(confirmPassword)}
              placeholder="Re-enter your password"
              error={confirmPasswordError}
              required
              autoComplete="new-password"
              rightSlot={
                <PasswordToggle
                  show={showConfirmPassword}
                  onToggle={() => setShowConfirmPassword((v) => !v)}
                />
              }
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Creating account...
                </span>
              ) : "Create account"}
            </button>

          </form>

          {/* Login link */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-orange-400 hover:text-orange-300 transition-colors"
            >
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}