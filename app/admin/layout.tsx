// app/admin/layout.tsx
import AdminSidebar from "@/components/admin/AdminSidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex gap-8">
        <AdminSidebar />
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}