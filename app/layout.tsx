// app/layout.tsx
import type { Metadata } from "next"
import { Geist } from "next/font/google"
import Navbar        from "@/components/layout/Navbar"
import Footer        from "@/components/layout/Footer"
import { AuthProvider } from "@/lib/auth-context"
import "./globals.css"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MotorShop — Find Parts for Your Vehicle",
  description: "Search auto parts by Year, Make, and Model",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-gray-950 flex flex-col min-h-screen`}>
        {/* AuthProvider makes auth state available to ALL components */}
        <AuthProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}