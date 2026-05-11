// app/api/webhook/stripe/route.ts
// Stripe calls this URL when a payment succeeds or fails
// This is how your server learns a payment was completed

import { NextResponse } from "next/server"
import { stripe }       from "@/lib/stripe"
import { prisma }       from "@/lib/prisma"

// IMPORTANT: Stripe sends raw body — must NOT parse as JSON
export async function POST(request: Request) {
  const body      = await request.text()
  const signature = request.headers.get("stripe-signature")!

  let event

  try {
    // Verify the webhook came from Stripe — not a fake request
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  // ── Handle payment events ─────────────────────────
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object

    // Update order status to PAID
    await prisma.order.updateMany({
      where: { stripePaymentId: paymentIntent.id },
      data:  { status: "PAID" },
    })

    console.log(`✅ Order paid: ${paymentIntent.metadata.orderId}`)
  }

  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object

    // Update order status to CANCELLED
    await prisma.order.updateMany({
      where: { stripePaymentId: paymentIntent.id },
      data:  { status: "CANCELLED" },
    })

    console.log(`❌ Payment failed: ${paymentIntent.metadata.orderId}`)
  }

  return NextResponse.json({ received: true })
}