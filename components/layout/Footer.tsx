// components/layout/Footer.tsx

export default function Footer() {
    return (
      <footer className="bg-gray-950 border-t border-gray-800 py-8 px-6 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
  
          <p className="text-orange-500 font-bold text-sm">MotorShop</p>
  
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} MotorShop. All rights reserved.
          </p>
  
        </div>
      </footer>
    )
  }