// app/admin/layout.tsx
// Wraps all /admin pages with a sidebar navigation.
// The root layout (Navbar + Footer) still wraps this too.

import Link from "next/link"

// Admin pages read from the DB; skip static generation so `next build` works
// without DATABASE_URL (e.g. Docker builder stage).
export const dynamic = "force-dynamic"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex gap-8">

        {/* Sidebar */}
        <aside className="w-48 shrink-0">
          <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-4">
            Admin Panel
          </p>
          <nav className="flex flex-col gap-1">
            <SidebarLink href="/admin">
              Dashboard
            </SidebarLink>
            <SidebarLink href="/admin/products">
              Products
            </SidebarLink>
            <SidebarLink href="/admin/ymm">
              YMM Data
            </SidebarLink>
          </nav>
        </aside>

        {/* Page content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>

      </div>
    </div>
  )
}

// Simple sidebar link component
function SidebarLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 text-sm transition-colors"
    >
      {children}
    </Link>
  )
}