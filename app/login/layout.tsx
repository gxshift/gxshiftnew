import React from 'react';

// KUNCI FIX: Beri tahu Cloudflare bahwa rute dinamis ini berjalan di Edge, bukan Node.js!
export const runtime = 'edge'; 
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}