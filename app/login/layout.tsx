import React from 'react';

// KUNCI PERBAIKAN: Memaksa rute ini menjadi dinamis agar bisa menerima request POST dari Server Action
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}