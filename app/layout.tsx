// app/layout.tsx
// This is the ROOT LAYOUT — it wraps EVERY page in your entire app.
// Navbar and Footer go here so they appear everywhere automatically.

import type { Metadata } from "next"
import { Geist } from "next/font/google"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import "./globals.css"

const geist = Geist({ subsets: ["latin"] })

// This object controls the <title> and meta description in the browser tab
export const metadata: Metadata = {
  title: "MotorShop — Find Parts for Your Vehicle",
  description: "Search auto parts by Year, Make, and Model",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode  // 'children' is whatever page is currently active
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-gray-950 flex flex-col min-h-screen`}>
        <Navbar />
        <main className="flex-1">
          {children}  {/* ← Your active page renders here */}
        </main>
        <Footer />
      </body>
    </html>
  )
}