// app/admin/page.tsx
// Admin dashboard overview — shows key stats at a glance

import { prisma } from "@/lib/prisma"
import Link       from "next/link"

async function getStats() {
  const [
    totalProducts,
    totalUsers,
    inStockProducts,
    totalYears,
    totalOrders,      
    paidOrders,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.user.count(),
    prisma.product.count({ where: { inStock: true } }),
    prisma.year.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PAID" } }),
  ])

  return {
    totalProducts,
    totalUsers,
    inStockProducts,
    totalYears,
    totalOrders,
    paidOrders,
  }
}
export default async function AdminDashboard() {
  const stats = await getStats()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-gray-500 text-sm">Welcome to the admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Products" value={stats.totalProducts} />
        <StatCard label="In Stock"       value={stats.inStockProducts} />
        <StatCard label="Total Users"    value={stats.totalUsers} />
        <StatCard label="Vehicle Years"  value={stats.totalYears} />
        <StatCard label="Total Orders"  value={stats.totalOrders} />
        <StatCard label="Paid Orders"   value={stats.paidOrders} />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-white font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ActionCard
            title="Add New Product"
            description="Create a new part or accessory listing"
            href="/admin/products/new"
          />
          <ActionCard
            title="Manage Products"
            description="Edit, update stock, or delete products"
            href="/admin/products"
          />
        </div>
      </div>
    </div>
  )
}

// ── Stat Card ─────────────────────────────────────────────
function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <p className="text-gray-500 text-xs mb-1">{label}</p>
      <p className="text-white text-3xl font-bold">{value}</p>
    </div>
  )
}

// ── Action Card ───────────────────────────────────────────
function ActionCard({
  title,
  description,
  href,
}: {
  title:       string
  description: string
  href:        string
}) {
  return (
    <Link
      href={href}
      className="bg-gray-900 border border-gray-800 hover:border-orange-500 rounded-xl p-5 transition-colors group"
    >
      <h3 className="text-white font-medium mb-1 group-hover:text-orange-400 transition-colors">
        {title}
      </h3>
      <p className="text-gray-500 text-sm">{description}</p>
    </Link>
  )
}