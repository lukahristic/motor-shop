// app/api/checkout/route.ts
// POST /api/checkout
// Creates an order + Stripe payment intent
// Returns the client secret for the frontend

import { prisma }           from "@/lib/prisma"
import { stripe }           from "@/lib/stripe"
import { cookies }          from "next/headers"
import { verifyToken }      from "@/lib/auth"
import { successResponse, ApiErrors } from "@/lib/api-response"
import { CartItem }         from "@/types"

export async function POST(request: Request) {
  try {
    // ── Verify user is logged in ──────────────────────
    const cookieStore = await cookies()
    const token       = cookieStore.get("auth-token")?.value

    if (!token) return ApiErrors.unauthorized()

    const payload = verifyToken(token)

    // ── Parse cart from request ───────────────────────
    const body: { items: CartItem[] } = await request.json()

    if (!body.items || body.items.length === 0) {
      return ApiErrors.badRequest("Cart is empty")
    }

    // ── Verify products exist + calculate total ───────
    // Always calculate price server-side — never trust the client
    const productIds = body.items.map((i) => i.productId)

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    })

    if (products.length !== productIds.length) {
      return ApiErrors.badRequest("One or more products not found")
    }

    // Calculate total from real DB prices
    const total = body.items.reduce((sum, cartItem) => {
      const product = products.find((p) => p.id === cartItem.productId)!
      return sum + Number(product.price) * cartItem.quantity
    }, 0)

    // ── Create order in DB (status: PENDING) ──────────
    const order = await prisma.order.create({
      data: {
        userId: payload.id,
        total,
        status: "PENDING",
        items: {
          create: body.items.map((cartItem) => {
            const product = products.find(
              (p) => p.id === cartItem.productId
            )!
            return {
              productId: cartItem.productId,
              quantity:  cartItem.quantity,
              price:     Number(product.price),
            }
          }),
        },
      },
    })

    // ── Create Stripe payment intent ──────────────────
    const paymentIntent = await stripe.paymentIntents.create({
      amount:   Math.round(total * 100), // Stripe uses cents
      currency: "php",                   // Philippine Peso
      metadata: {
        orderId: String(order.id),
        userId:  String(payload.id),
      },
    })

    // Save Stripe payment intent ID to order
    await prisma.order.update({
      where: { id: order.id },
      data:  { stripePaymentId: paymentIntent.id },
    })

    // Return client secret — browser uses this to confirm payment
    return successResponse({
      clientSecret: paymentIntent.client_secret,
      orderId:      order.id,
    })
  } catch (error) {
    console.error("Checkout error:", error)
    return ApiErrors.serverError(error)
  }
}