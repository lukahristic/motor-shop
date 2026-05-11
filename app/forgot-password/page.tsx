// app/forgot-password/page.tsx
// Placeholder — full email reset flow can be added later

import Link from "next/link"

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">

        <h1 className="text-3xl font-bold text-white mb-4">
          Forgot your password?
        </h1>
        <p className="text-gray-400 mb-6">
          Password reset via email is coming soon. For now, please contact support.
        </p>
        <Link
          href="/login"
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
        >
          Back to Login
        </Link>
      </div>
    </div>
  )
}