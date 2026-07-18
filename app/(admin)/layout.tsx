import React from 'react';
import type { Metadata } from 'next';
import AdminSidebar from '@/components/layouts/AdminSidebar';
import { Providers } from '../providers';
import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'GXSHIFT | Admin Command Center',
  description: 'Control panel for GXSHIFT Platform',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  // ==========================================
  // 🚀 KUNCI FIX MUTLAK: HARDCODE FALLBACK
  // Menghancurkan Bug "Blind Edge" Cloudflare
  // ==========================================
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xozvcoknqgzftjlsngba.supabase.co';
  
  // MASUKKAN KODE PANJANG ANON KEY ANDA DI BAWAH INI (Yang berawalan eyJhbGci...):
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvenZjb2tucWd6ZnRqbHNuZ2JhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2ODEyODUsImV4cCI6MjA5OTI1NzI4NX0.yxMNuFBfbZBI96BDAQB_krzBcKnGoJGyiCu3Kozj_Gc';

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      // KUNCI FIX TYPESCRIPT: Tambahkan tipe data eksplisit pada parameter ini
      setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
        // Diabaikan di Server Component
      },
    },
  });

  // Gunakan getSession() agar tidak terkena blokir jaringan Edge
  const { data: { session } } = await supabase.auth.getSession();

  // Jika sesi tidak ditemukan, tendang ke login
  if (!session) {
    redirect('/login');
  }
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