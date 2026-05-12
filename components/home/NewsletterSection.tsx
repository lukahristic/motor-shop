// components/home/NewsletterSection.tsx
// Static newsletter signup — no backend yet
// Wire up to an email service (Resend, Mailchimp) later

"use client"

import { useState } from "react"

export default function NewsletterSection() {
  const [email,     setEmail]     = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)

    // Simulate submission — wire to real email service later
    await new Promise((r) => setTimeout(r, 800))
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <section className="bg-gray-950 border-t border-gray-800 py-14">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">

        {/* Icon */}
        <div className="w-14 h-14 bg-orange-500/10 rounded-2xl
                        flex items-center justify-center mx-auto mb-5">
          <i className="ti ti-mail text-orange-500 text-2xl" aria-hidden="true" />
        </div>

        <h2 className="text-white text-2xl sm:text-3xl font-extrabold
                       tracking-tight mb-3">
          Get exclusive deals in your inbox
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          Join 12,000+ riders getting weekly promos, new arrivals,
          and expert maintenance tips.
        </p>

        {submitted ? (
          <div className="flex items-center justify-center gap-2
                          text-green-400 font-semibold">
            <i className="ti ti-check text-xl" aria-hidden="true" />
            You're in! Check your inbox for a welcome email.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex gap-3 flex-wrap sm:flex-nowrap justify-center"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 min-w-0 bg-gray-900 border border-gray-700
                         text-white rounded-lg px-4 py-3 text-sm
                         focus:outline-none focus:border-orange-500
                         transition-colors placeholder:text-gray-600
                         sm:max-w-xs"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600
                         disabled:opacity-60 text-white font-bold
                         rounded-lg text-sm transition-colors
                         whitespace-nowrap"
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        )}

        <p className="text-gray-700 text-xs mt-4">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  )
}