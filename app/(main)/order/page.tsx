import React, { Suspense } from 'react';
import { createClient } from '@supabase/supabase-js';
import OrderForm from '@/components/features/OrderForm';
import { Level, SiteSetting } from '@/types';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

// Inisialisasi Supabase Server-Side
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const revalidate = 0; 

export default async function OrderPage() {
  // Fetch Level (Paket) Mobile Legends yang aktif
  const { data: levelsData } = await supabase
    .from('levels')
    .select('*, games!inner(*)')
    .eq('is_active', true)
    .eq('games.slug', 'mobile-legends')
    .order('order_index');

  // Fetch Nomor WhatsApp Admin
  const { data: settingsData } = await supabase
    .from('settings')
    .select('*')
    .eq('setting_key', 'whatsapp_number')
    .single();

  const levels = (levelsData as Level[]) || [];
  const whatsappNumber = (settingsData as SiteSetting)?.setting_value || '6282120002589';

  return (
    <div className="min-h-screen bg-background relative pt-24 pb-12 px-4 sm:px-6">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/assets/grid.svg')] bg-center opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Navigasi Kembali */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-primary transition-colors mb-8"
        >
          <ChevronLeft size={16} />
          KEMBALI KE BERANDA
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white">Checkout</h1>
          <p className="text-primary text-sm font-bold tracking-[0.2em] mt-2 uppercase">Fast, Safe, and Reliable</p>
        </div>

        {/* Suspense diperlukan karena OrderForm menggunakan useSearchParams() */}
        <Suspense fallback={
          <div className="w-full max-w-4xl mx-auto h-96 glass-panel rounded-3xl flex items-center justify-center border border-white/5">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        }>
          <OrderForm levels={levels} adminWhatsapp={whatsappNumber} />
        </Suspense>
      </div>
    </div>
  );
}