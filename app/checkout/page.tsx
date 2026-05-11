// app/checkout/page.tsx
"use client"

import { useEffect, useState }  from "react"
import { useCart }              from "@/lib/cart-context"
import { useRouter }            from "next/navigation"
import { loadStripe }           from "@stripe/stripe-js"
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js"

// Load Stripe outside component to avoid recreating on every render
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

export default function CheckoutPage() {
  const { cart }                      = useCart()
  const router                        = useRouter()
  const [clientSecret, setClientSecret] = useState("")
  const [orderId, setOrderId]           = useState<number | null>(null)
  const [error, setError]               = useState("")

  // Create payment intent when page loads
  useEffect(() => {
    if (cart.items.length === 0) {
      router.push("/cart")
      return
    }

    async function createPaymentIntent() {
      try {
        const res  = await fetch("/api/checkout", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ items: cart.items }),
        })

        const json = await res.json()

        if (!res.ok) throw new Error(json.error)

        setClientSecret(json.data.clientSecret)
        setOrderId(json.data.orderId)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to initialize checkout"
        )
      }
    }

    createPaymentIntent()
  }, [])

  if (error) {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <a href="/cart" className="text-orange-400 hover:text-orange-300">
          ← Back to cart
        </a>
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 text-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Preparing checkout...</p>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">Checkout</h1>
      <p className="text-gray-500 text-sm mb-8">
        Total: ${cart.total.toFixed(2)}
      </p>

      {/* Stripe Elements provides the card form */}
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            theme: "night",
            variables: {
              colorPrimary:    "#f97316",
              colorBackground: "#111827",
              colorText:       "#ffffff",
              borderRadius:    "8px",
            },
          },
        }}
      >
        <CheckoutForm orderId={orderId} />
      </Elements>
    </div>
  )
}

// ── CheckoutForm — uses Stripe hooks (must be inside <Elements>) ──
function CheckoutForm({ orderId }: { orderId: number | null }) {
  const stripe   = useStripe()
  const elements = useElements()
  const router   = useRouter()
  const { clearCart } = useCart()

  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    setError("")

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Stripe redirects here after payment
        return_url: `${window.location.origin}/order-success?orderId=${orderId}`,
      },
    })

    if (stripeError) {
      setError(stripeError.message ?? "Payment failed")
      setLoading(false)
    }
    // If no error, Stripe redirects to return_url automatically
    // clearCart() happens on the success page
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <PaymentElement />
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-900/40 border border-red-700 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>

      <p className="text-center text-gray-600 text-xs">
        🔒 Secured by Stripe — your card details never touch our server
      </p>
    </form>
  )
}