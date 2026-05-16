# PR PMII Rayon Teknik UNUSIA Jakarta Pusat

Platform digital terpadu untuk manajemen kader PR PMII Rayon Teknik UNUSIA Jakarta Pusat. Dibangun dengan Next.js 16, Prisma + MariaDB, dan animasi framer-motion.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Database**: MariaDB via Prisma ORM
- **Auth**: NextAuth v5 (Credentials + GitHub OAuth)
- **Animasi**: framer-motion, @react-spring/web, three.js (@react-three/fiber)
- **Styling**: Tailwind CSS v4
- **Komponen UI**: Lucide React, Recharts, Lottie

## Memulai

### 1. Clone & Install

```bash
npm install
```

### 2. Environment Variables

Salin `.env.example` ke `.env.local` dan isi:

```env
DATABASE_URL="mysql://user:password@localhost:3306/fullstack_db"
AUTH_SECRET="your-secret"
AUTH_GITHUB_ID=""
AUTH_GITHUB_SECRET=""
```

### 3. Setup Database

```bash
npx prisma db push
npm run seed
```

### 4. Development

```bash
npm run dev
```

## Scripts

| Perintah | Deskripsi |
|----------|-----------|
| `npm run dev` | Jalankan dev server (port 3000) |
| `npm run dev:alt` | Jalankan dev server (port 3006) |
| `npm run build` | Generate Prisma client + build Next.js |
| `npm run seed` | Seed database dengan data dummy |
| `npm run lint` | Jalankan ESLint |

## Struktur

```
src/
├── app/            # Rute & halaman (App Router)
│   ├── (pages)/    # Halaman publik (/, /berita, /donasi, ...)
│   ├── admin/      # Panel admin (protected)
│   ├── api/        # API routes (REST + SSE)
│   └── login/      # Halaman login
├── components/     # Komponen React
│   ├── three/      # Komponen Three.js (3D, fisika)
│   └── admin/      # Komponen khusus admin
├── hooks/          # Custom hooks
├── lib/            # Utility, auth, prisma client
├── store/          # Zustand state
└── types/          # TypeScript types
```

## Fitur

- **Animasi 3D**: Hero section dengan particle system + floating orb interaktif
- **Physics Playground**: Objek 3D clickable dengan fisika realistic (Rapier)
- **Smooth Scroll**: Lenis + framer-motion scroll animations
- **Donasi Real-time**: SSE stream untuk live donation total
- **PWA**: Service worker dengan cache-first strategy
- **Dark Mode**: Full dark theme dengan design system terintegrasi
- **Admin Panel**: CRUD berita, kegiatan, manajemen donasi & kontak
- **SEO**: Sitemap, robots.txt, Open Graph, JSON-LD structured data
- **Accessibility**: Skip-to-content, reduced motion support, aria labels

## Deployment

Build untuk production:

```bash
npm run build
```

Deploy ke Vercel atau platform Node.js lainnya. Pastikan variabel environment `DATABASE_URL` dan `AUTH_SECRET` terisi.
