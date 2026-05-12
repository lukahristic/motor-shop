// lib/homepage-data.ts
// Static content for the homepage sections.
// Reviews, trust items, and brands live here so the page stays clean.

export const trustItems = [
    {
      icon: "ti-truck",
      label: "Free shipping ₱1,500+",
    },
    {
      icon: "ti-shield-check",
      label: "100% genuine parts",
    },
    {
      icon: "ti-clock",
      label: "Same-day dispatch",
    },
    {
      icon: "ti-headset",
      label: "Expert support",
    },
    {
      icon: "ti-refresh",
      label: "30-day returns",
    },
  ]
  
  export const categories = [
    {
      title:       "Big Bike Parts",
      description: "Sport bikes, nakeds, and adventure tourers. Kawasaki, BMW, Honda, Ducati and more.",
      href:        "/big-bikes",
      emoji:       "🏍️",
      accent:      "from-orange-900/80 to-gray-950",
      brands:      ["Kawasaki", "BMW", "Honda", "Ducati"],
    },
    {
      title:       "Scooter Parts",
      description: "Honda Click, Yamaha NMAX, Aerox, Mio, and all popular PH scooters.",
      href:        "/scooters",
      emoji:       "🛵",
      accent:      "from-blue-900/80 to-gray-950",
      brands:      ["Honda", "Yamaha", "Suzuki", "Kymco"],
    },
    {
      title:       "Gear & Accessories",
      description: "Helmets, gloves, jackets, covers, and everything a rider needs.",
      href:        "/products?category=Accessories",
      emoji:       "🥊",
      accent:      "from-emerald-900/80 to-gray-950",
      brands:      ["Shoei", "Arai", "AGV", "HJC"],
    },
  ]
  
  export const brands = [
    "Honda", "Yamaha", "Kawasaki",
    "Suzuki", "BMW", "Ducati",
    "KTM", "Triumph",
  ]
  
  export const reviews = [
    {
      stars:   5,
      text:    "Got my brake pads in 2 days. Fit my Kawasaki Z400 perfectly. Will definitely order again.",
      name:    "Marco R.",
      vehicle: "2022 Kawasaki Z400",
    },
    {
      stars:   5,
      text:    "Best prices I've found in PH for genuine Honda Click parts. The YMM filter makes it so easy to find the right fit.",
      name:    "Jasmine T.",
      vehicle: "2023 Honda Click 125i",
    },
    {
      stars:   4,
      text:    "Great selection and fast shipping. Customer support helped me pick the right oil filter for my setup.",
      name:    "Dennis M.",
      vehicle: "2021 Yamaha NMAX 155",
    },
  ]
  
  export const whyItems = [
    {
      icon:  "ti-shield-check",
      title: "100% genuine parts",
      text:  "Every part is sourced directly from authorized distributors. No fakes, no counterfeits, ever.",
    },
    {
      icon:  "ti-truck",
      title: "Fast nationwide delivery",
      text:  "Metro Manila in 48 hours, provincial in 3–5 days via our trusted courier partners.",
    },
    {
      icon:  "ti-headset",
      title: "Expert support",
      text:  "Our team of mechanics is available Mon–Sat to help you find the exact right part.",
    },
    {
      icon:  "ti-refresh",
      title: "Hassle-free returns",
      text:  "Wrong part? Wrong fit? Return it within 30 days — no questions asked.",
    },
  ]