// app/admin/layout.tsx
// Uses AdminDrawer which handles both desktop sidebar and mobile drawer

import AdminDrawer from "@/components/admin/AdminDrawer"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <AdminDrawer>
        {children}
      </AdminDrawer>
    </div>
  )
}