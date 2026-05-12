// app/layout.tsx
import type { Metadata }   from "next"
import { Geist }           from "next/font/google"
import Navbar              from "@/components/layout/Navbar"
import Footer              from "@/components/layout/Footer"
import { AuthProvider }    from "@/lib/auth-context"
import { CartProvider }    from "@/lib/cart-context"
import "./globals.css"
import "@tabler/icons-webfont/dist/tabler-icons.min.css"

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
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}