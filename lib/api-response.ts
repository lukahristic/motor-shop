// lib/api-response.ts
// Centralised helper for consistent API responses across all routes.
// Every route uses these functions instead of writing NextResponse.json manually.

import { NextResponse } from "next/server"

// TypeScript generics — T is a placeholder for any data type
// When you call successResponse<Product>(...), T becomes Product
// This gives you full type safety on the data field

export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200
) {
  return NextResponse.json(
    {
      success: true,
      data,
      message: message ?? null,
    },
    { status }
  )
}

export function createdResponse<T>(data: T, message?: string) {
  return successResponse(data, message ?? "Resource created successfully", 201)
}

export function errorResponse(
  error: string,
  status: number = 500,
  details?: unknown
) {
  return NextResponse.json(
    {
      success: false,
      error,
      details: details ?? null,
    },
    { status }
  )
}

// Pre-built common error responses
// So you never have to remember the exact wording or status code
export const ApiErrors = {
  notFound: (resource: string = "Resource") =>
    errorResponse(`${resource} not found`, 404),

  badRequest: (message: string) =>
    errorResponse(message, 400),

  unauthorized: () =>
    errorResponse("You must be logged in to do this", 401),

  forbidden: () =>
    errorResponse("You do not have permission to do this", 403),

  serverError: (details?: unknown) =>
    errorResponse("An unexpected error occurred", 500, details),
}