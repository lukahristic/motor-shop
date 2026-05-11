// components/admin/MobileAdminHeader.tsx
// Only visible on mobile — shows hamburger button to open the drawer

"use client"

interface Props {
  onOpen: () => void
}

export default function MobileAdminHeader({ onOpen }: Props) {
  return (
    <div className="lg:hidden flex items-center gap-3 mb-6 pb-4 border-b border-gray-800">

      {/* Hamburger button */}
      <button
        onClick={onOpen}
        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        aria-label="Open admin menu"
      >
        {/* Hamburger ≡ icon */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="6"  x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      <p className="text-gray-400 text-sm font-medium">Admin Panel</p>
    </div>
  )
}