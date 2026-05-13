// lib/navbar-data.ts
// All navigation structure defined in one place.
// Update this file to change navbar links — no touching the component.

export const categoryLinks = [
    {
      label:       "Big Bike Parts",
      href:        "/big-bikes",
      description: "Sport bikes, nakeds, adventure tourers",
      emoji:       "🏍️",
    },
    {
      label:       "Scooter Parts",
      href:        "/scooters",
      description: "Honda Click, NMAX, Aerox, Mio and more",
      emoji:       "🛵",
    },
    {
      label:       "Accessories & Gear",
      href:        "/products?category=Accessories",
      description: "Helmets, gloves, jackets, covers",
      emoji:       "🥊",
    },
  ]
  
  export const shopLinks = [
    { label: "All Products",  href: "/products"              },
    { label: "Hot Deals",     href: "/products?sale=true"    },
    { label: "New Arrivals",  href: "/products?new=true"     },
    { label: "Big Bikes",     href: "/big-bikes"             },
    { label: "Scooters",      href: "/scooters"              },
  ]
  
  export const accountLinks = [
    { label: "My Orders",    href: "/orders",   icon: "ti-package"   },
    { label: "My Cart",      href: "/cart",     icon: "ti-shopping-bag" },
    { label: "My Profile",   href: "/profile",  icon: "ti-user"      },
  ]