import React from 'react';
import type { Metadata } from 'next';
import AdminSidebar from '@/components/layouts/AdminSidebar';
import { Providers } from '../providers';
import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// KUNCI FIX: Wajib edge & force-dynamic agar Cloudflare tidak pernah meng-cache halaman Admin
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'GXSHIFT | Admin Command Center',
  description: 'Control panel for GXSHIFT Platform',
};

// Ubah menjadi async function karena kita akan menggunakan await cookies() dan getUser()
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  // ==========================================
  // 🛡️ START SECURITY GUARD (PENGGANTI MIDDLEWARE)
  // ==========================================
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Jika tidak ada user (belum login/cookie hilang), tendang paksa ke /login
  if (!user) {
    redirect('/login');
  }
  // ==========================================
  // 🛡️ END SECURITY GUARD
  // ==========================================

  return (
    <div className="flex h-screen bg-[#020202] text-white overflow-hidden font-sans selection:bg-primary selection:text-black">
      <Providers>
        <AdminSidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto relative">
          {/* Background Ambient Admin */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
          
          <div className="p-4 md:p-8 min-h-full">
            {children}
          </div>
        </main>
      </Providers>
    </div>
  );
}