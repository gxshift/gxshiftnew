import React from 'react';

// KUNCI PERBAIKAN: Memaksa Cloudflare agar TIDAK PERNAH meng-cache HTML halaman Login
// sehingga browser selalu mendapat file JavaScript versi terbaru.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}