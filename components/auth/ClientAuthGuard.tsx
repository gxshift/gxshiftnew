'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js'; // KUNCI: Pakai library standar, BUKAN SSR
import { useRouter } from 'next/navigation';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

// Inisialisasi murni Client-Side (Menyimpan tiket di LocalStorage, kebal dari Cloudflare)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ClientAuthGuard({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setStatus('authenticated');
      } else {
        setStatus('unauthenticated');
        // Beri waktu 2 detik agar Anda bisa melihat pesan error jika gagal
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    };
    checkAuth();
  }, [router]);

  if (status === 'loading') {
    return (
      <div className="h-screen w-screen bg-[#020202] flex flex-col items-center justify-center text-primary">
        <ShieldCheck size={48} className="animate-pulse mb-4" />
        <p className="text-xs uppercase tracking-[0.3em] font-bold animate-pulse text-gray-400">
          MEMVERIFIKASI MEMORI BROWSER...
        </p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="h-screen w-screen bg-[#020202] flex flex-col items-center justify-center text-red-500">
        <AlertTriangle size={48} className="mb-4" />
        <p className="text-sm font-bold uppercase tracking-widest">AKSES DITOLAK</p>
        <p className="text-xs text-gray-500 mt-2">Tiket tidak ditemukan. Mengembalikan ke Login...</p>
      </div>
    );
  }

  return <>{children}</>;
}