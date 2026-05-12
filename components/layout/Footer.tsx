// components/layout/Footer.tsx
import Link from "next/link"


export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800">

      {/* Main footer content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-orange-500 font-extrabold text-xl">
              MotorShop
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed mt-3 mb-4">
              Philippines no. 1 source for genuine motorcycle parts
              and accessories.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-8 h-8 bg-gray-800 hover:bg-orange-500
                          rounded-lg flex items-center justify-center
                          transition-colors"
                aria-label="Facebook"
              >
                <i
                  className="ti ti-brand-facebook text-gray-400
                            hover:text-white text-sm"
                  aria-hidden="true"
                />
              </a>

              <a
                href="#"
                className="w-8 h-8 bg-gray-800 hover:bg-orange-500
                          rounded-lg flex items-center justify-center
                          transition-colors"
                aria-label="Instagram"
              >
                <i
                  className="ti ti-brand-instagram text-gray-400
                            hover:text-white text-sm"
                  aria-hidden="true"
                />
              </a>
          </div>
          </div>

          {/* Shop links */}
          <div>
            <p className="text-white font-semibold text-sm mb-4">Shop</p>
            <ul className="space-y-2">
              {[
                { label: "All Products",    href: "/products"                  },
                { label: "Big Bike Parts",  href: "/big-bikes"                 },
                { label: "Scooter Parts",   href: "/scooters"                  },
                { label: "Accessories",     href: "/products?category=Accessories" },
                { label: "Hot Deals",       href: "/products?sale=true"        },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-orange-400
                               text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account links */}
          <div>
            <p className="text-white font-semibold text-sm mb-4">Account</p>
            <ul className="space-y-2">
              {[
                { label: "My Orders",  href: "/orders"   },
                { label: "My Cart",    href: "/cart"     },
                { label: "Login",      href: "/login"    },
                { label: "Register",   href: "/register" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-orange-400
                               text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <p className="text-white font-semibold text-sm mb-4">Support</p>
            <ul className="space-y-2">
              {[
                { label: "Contact Us",      href: "/contact"          },
                { label: "Shipping info",   href: "/shipping"         },
                { label: "Returns policy",  href: "/returns"          },
                { label: "Privacy policy",  href: "/privacy"          },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-orange-400
                               text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 px-4 sm:px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center
                        justify-between flex-wrap gap-3">
          <p className="text-gray-700 text-xs">
            © {new Date().getFullYear()} MotorShop. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-gray-700 text-xs">We accept:</span>
            {["Visa", "Mastercard", "GCash", "Maya"].map((p) => (
              <span
                key={p}
                className="bg-gray-800 text-gray-500 text-xs
                           font-semibold px-2 py-0.5 rounded"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

    </footer>
  )
}