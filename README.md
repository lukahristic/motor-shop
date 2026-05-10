# 🔧 MotorShop

A full-stack motor shop web application with Year, Make, Model (YMM) vehicle filtering. Built with Next.js, TypeScript, PostgreSQL, and Prisma — deployed on Vercel with Neon.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square&logo=vercel)

---

## 🚀 Live Demo

[https://motorshop-sepia-omega.vercel.app/](https://motorshop-sepia-omega.vercel.app/)

**Demo accounts:**
| Role  | Email               | Password     |
|-------|---------------------|--------------|
| Admin | admin@motorshop.com | password123  |
| User  | user@motorshop.com  | password123  |

---

## ✨ Features

### Customer Facing
- **YMM Filtering** — Search parts by Year → Make → Model with chained dependent dropdowns
- **Product Listing** — Browse all parts with category filtering and keyword search
- **Product Detail** — Full product page with compatibility info, price, and stock status
- **Vehicle-Specific Results** — Only shows parts compatible with the selected vehicle
- **Responsive Design** — Works on mobile, tablet, and desktop

### Authentication
- **Register / Login** — Secure account creation and login
- **HTTP-only Cookies** — JWT stored securely, invisible to JavaScript
- **Session Persistence** — Stays logged in across page refreshes
- **Role-based Access** — Admin and User roles with different permissions

### Admin Dashboard
- **Product Management** — Create, edit, and delete products
- **YMM Management** — Add and delete Years, Makes, and Models
- **Live Stats** — Dashboard showing total products, stock levels, and users
- **Protected Routes** — Middleware blocks non-admin access automatically

---

## 🛠️ Tech Stack

| Layer        | Technology                        |
|--------------|-----------------------------------|
| Framework    | Next.js 15 (App Router)           |
| Language     | TypeScript                        |
| Styling      | Tailwind CSS                      |
| Database     | PostgreSQL (Neon)                 |
| ORM          | Prisma                            |
| Auth         | JWT + bcrypt + HTTP-only cookies  |
| Deployment   | Vercel                            |
| Dev Database | Docker + PostgreSQL               |
| API Testing  | Postman                           |

---

## 📁 Project Structure

```
motor-shop/
├── app/
│   ├── layout.tsx                    # Root layout — Navbar + Footer
│   ├── page.tsx                      # Homepage with YMM selector
│   ├── products/
│   │   ├── page.tsx                  # Product listing with filters
│   │   └── [slug]/page.tsx           # Product detail page
│   ├── admin/
│   │   ├── layout.tsx                # Admin layout with sidebar
│   │   ├── page.tsx                  # Dashboard with stats
│   │   ├── products/
│   │   │   ├── page.tsx              # Product management table
│   │   │   ├── new/page.tsx          # Create product form
│   │   │   └── [id]/edit/page.tsx    # Edit product form
│   │   └── ymm/page.tsx              # YMM data management
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts
│       │   ├── register/route.ts
│       │   ├── logout/route.ts
│       │   └── me/route.ts
│       ├── products/
│       │   ├── route.ts              # GET all, POST create
│       │   ├── [id]/route.ts         # GET one, PUT update, DELETE
│       │   └── by-vehicle/route.ts   # GET by YMM compatibility
│       ├── ymm/
│       │   ├── years/route.ts
│       │   ├── makes/route.ts
│       │   └── models/route.ts
│       └── admin/ymm/
│           ├── years/route.ts
│           ├── years/[id]/route.ts
│           ├── makes/route.ts
│           ├── makes/[id]/route.ts
│           ├── models/route.ts
│           └── models/[id]/route.ts
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx                # Dynamic auth-aware navbar
│   │   └── Footer.tsx
│   ├── ui/
│   │   ├── YMMSelector.tsx           # Chained dropdown selector
│   │   ├── ProductCard.tsx           # Product grid card
│   │   ├── FeatureCard.tsx           # Homepage feature cards
│   │   ├── SearchBar.tsx             # Live search input
│   │   └── CategoryFilter.tsx        # Category filter buttons
│   └── admin/
│       ├── AdminSidebar.tsx          # Active-link sidebar
│       ├── DeleteProductButton.tsx   # Client-side delete with confirm
│       ├── EditProductForm.tsx       # Pre-filled edit form
│       └── YMMManager.tsx            # Full YMM CRUD interface
├── lib/
│   ├── prisma.ts                     # Prisma singleton
│   ├── auth.ts                       # bcrypt + JWT utilities
│   ├── auth-context.tsx              # Global auth state (React Context)
│   ├── api-response.ts               # Consistent API response helpers
│   ├── mock-data.ts                  # Development mock data
│   ├── constants.ts                  # Shared constants
│   └── get-user.ts                   # Read user from request headers
├── types/
│   └── index.ts                      # Shared TypeScript interfaces
├── prisma/
│   ├── schema.prisma                 # Database schema
│   ├── seed.ts                       # Seed data script
│   └── migrations/                   # Migration history
├── middleware.ts                     # Auth + role protection
├── docker-compose.yml                # Local PostgreSQL
└── next.config.ts
```

---

## 🗄️ Database Schema

```
Year ──< Make ──< Model ──< ProductCompatibility >── Product
                                                          │
                                                        User (role: ADMIN | USER)
```

- A **Year** has many **Makes**
- A **Make** has many **Models**
- A **Model** has many **Products** through **ProductCompatibility**
- A **Product** can be compatible with many **Models**
- A **User** has a role of either `ADMIN` or `USER`

---

## 🔌 API Reference

### Auth
| Method | Endpoint             | Description              | Auth     |
|--------|----------------------|--------------------------|----------|
| POST   | /api/auth/register   | Create account           | Public   |
| POST   | /api/auth/login      | Login, sets cookie       | Public   |
| POST   | /api/auth/logout     | Clear auth cookie        | Public   |
| GET    | /api/auth/me         | Get current user         | Required |

### Products
| Method | Endpoint                        | Description                    | Auth     |
|--------|---------------------------------|--------------------------------|----------|
| GET    | /api/products                   | Get all products               | Public   |
| POST   | /api/products                   | Create product                 | Admin    |
| GET    | /api/products/:id               | Get single product             | Public   |
| PUT    | /api/products/:id               | Update product                 | Admin    |
| DELETE | /api/products/:id               | Delete product                 | Admin    |
| GET    | /api/products/by-vehicle        | Get products by YMM            | Public   |

### YMM (Public)
| Method | Endpoint                        | Description                    |
|--------|---------------------------------|--------------------------------|
| GET    | /api/ymm/years                  | All years                      |
| GET    | /api/ymm/makes?year=X           | Makes for a year               |
| GET    | /api/ymm/models?year=X&make=Y   | Models for a year + make       |

### YMM (Admin)
| Method | Endpoint                        | Description                    |
|--------|---------------------------------|--------------------------------|
| POST   | /api/admin/ymm/years            | Add a year                     |
| DELETE | /api/admin/ymm/years/:id        | Delete a year                  |
| POST   | /api/admin/ymm/makes            | Add a make                     |
| DELETE | /api/admin/ymm/makes/:id        | Delete a make                  |
| POST   | /api/admin/ymm/models           | Add a model                    |
| DELETE | /api/admin/ymm/models/:id       | Delete a model                 |

---

## 🏃 Running Locally

### Prerequisites

- Node.js 20+
- Docker Desktop
- Git

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/motor-shop.git
cd motor-shop
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Fill in your `.env`:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/motorshop"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/motorshop"
JWT_SECRET="your-secret-key-minimum-32-characters"
BCRYPT_ROUNDS=10
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### 4. Start the database

```bash
docker-compose up -d
```

### 5. Run migrations and seed data

```bash
npx prisma migrate dev
npx prisma db seed
```

### 6. Start the development server

```bash
npm run dev
```

Visit **http://localhost:3000**

---

## 🚢 Deployment

This project is deployed on **Vercel** with **Neon** as the managed PostgreSQL database.

### Deploy your own

1. Fork this repo
2. Create a free account on [Neon](https://neon.tech) and create a project
3. Create a free account on [Vercel](https://vercel.com) and import this repo
4. Add the following environment variables in Vercel:

```
DATABASE_URL        → Neon pooled connection string
DIRECT_URL          → Neon direct connection string
JWT_SECRET          → a long random secret string
BCRYPT_ROUNDS       → 10
NEXT_PUBLIC_API_URL → your Vercel deployment URL
```

5. Run migrations against Neon:

```bash
npx prisma migrate deploy
npx prisma db seed
```

6. Push to `main` — Vercel auto-deploys on every push.

---

## 🔒 Security

- Passwords hashed with **bcrypt** (never stored as plain text)
- Auth tokens stored in **HTTP-only cookies** (invisible to JavaScript, XSS-safe)
- **Middleware** protects all admin routes and mutation endpoints
- Same error message for wrong email and wrong password (prevents user enumeration)
- Role-based guards on both API routes and frontend pages
- Environment variables for all secrets (never committed to Git)

---

## 📚 What I Learned Building This

This project was built as a full learning journey from scratch. Key concepts covered:

- **Next.js App Router** — pages, layouts, server components, client components
- **TypeScript** — interfaces, generics, union types, type safety throughout
- **REST API Design** — HTTP methods, status codes, consistent response envelopes
- **PostgreSQL + Prisma** — schema design, relations, migrations, seeding
- **Authentication** — bcrypt, JWT, HTTP-only cookies, session management
- **Middleware** — request interception, role-based access control
- **React Patterns** — useState, useEffect, useContext, derived state
- **Docker** — containerised local development database
- **CI/CD** — automatic deployment on every git push via Vercel
- **Git workflow** — conventional commits, branching, GitHub

---

## 👤 Author

Built by **Wency**

- GitHub: [@lukahristic](https://github.com/lukahristic)

---

## 📄 License

MIT License — feel free to use this project as a reference or starting point.