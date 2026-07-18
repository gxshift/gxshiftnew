# GXSHIFT 🎮 | Premium Gaming Service Platform

![GXSHIFT Banner](/public/assets/og-image.jpg)

GXSHIFT adalah platform *e-commerce* layanan *boosting* game premium yang dibangun dengan arsitektur **Next.js 15 App Router**. Dirancang dengan estetika *AAA Gaming* yang mengusung tema *Dark/Neon Glassmorphism*, platform ini dilengkapi dengan sistem pemesanan cerdas yang terintegrasi langsung ke WhatsApp, serta Dashboard CMS (Content Management System) kustom berbasis **Supabase** untuk pengelolaan data secara *real-time*.

## ✨ Key Features

* **Cinematic UI/UX:** Transisi halaman yang mulus dengan Framer Motion (Blast Door Overlay), efek *parallax*, *tilt-card*, dan *glow* yang memanjakan mata.
* **Server-Side Rendering (SSR):** Optimasi SEO dan kecepatan pemuatan halaman memanfaatkan arsitektur Next.js 15.
* **Dynamic Package Carousel:** Tampilan interaktif produk menggunakan Embla Carousel yang responsif di semua perangkat.
* **Secure Checkout Flow:** Validasi *form* ketat (Zod + React Hook Form) yang menghasilkan format pesanan otomatis ke WhatsApp Admin.
* **Role-Based Access Control (RBAC):** Middleware keamanan tingkat tinggi yang melindungi area Dasbor menggunakan otentikasi sesi Supabase (SSR).
* **Full CMS Dashboard:** Panel kontrol admin intuitif untuk operasi CRUD (Create, Read, Update, Delete) pada data Games, Levels (Paket), dan memantau Statistik Pesanan.

## 🛠️ Tech Stack

* **Framework:** [Next.js 15](https://nextjs.org/) (React 19, App Router)
* **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Animations:** [Framer Motion](https://www.framer.com/motion/)
* **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security)
* **Form & Validation:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
* **Carousel:** [Embla Carousel React](https://www.embla-carousel.com/)
* **Icons & Notifications:** [Lucide React](https://lucide.dev/) + [Sonner Toast](https://sonner.emilkowal.ski/)
* **Deployment:** [Netlify](https://www.netlify.com/)

## 🚀 Getting Started (Local Development)

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di mesin lokal Anda.

### 1. Prerequisites
* Node.js v18.17.0 atau lebih baru.
* Akun [Supabase](https://supabase.com/).

### 2. Clone Repository
```bash
git clone [https://github.com/username-anda/gxshift-web.git](https://github.com/username-anda/gxshift-web.git)
cd gxshift-web