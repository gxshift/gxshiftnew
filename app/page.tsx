import React from 'react';
import { createClient } from '@supabase/supabase-js';
import LandingContent from '@/components/features/LandingContent';
import { Level, Faq, Testimonial, SiteSetting } from '@/types';

// Inisialisasi Supabase Server-Side
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const revalidate = 0; // Disable cache agar data selalu aktual

export default async function Home() {
  // 1. Fetch Levels (Hanya yang aktif dan dari game Mobile Legends)
  const { data: levelsData } = await supabase
    .from('levels')
    .select('*, games!inner(*)')
    .eq('is_active', true)
    .eq('games.slug', 'mobile-legends')
    .order('order_index');

  // 2. Fetch FAQs
  const { data: faqsData } = await supabase
    .from('faqs')
    .select('*')
    .eq('is_active', true)
    .order('order_index');

  // 3. Fetch Testimonials
  const { data: testimonialsData } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(3);

  // 4. Fetch Settings (WhatsApp)
  const { data: settingsData } = await supabase
    .from('settings')
    .select('*')
    .eq('setting_key', 'whatsapp_number')
    .single();

  // Parsing Data
  const levels = (levelsData as Level[]) || [];
  const faqs = (faqsData as Faq[]) || [];
  const testimonials = (testimonialsData as Testimonial[]) || [];
  const whatsappNumber = (settingsData as SiteSetting)?.setting_value || '6282120002589';
 
  
  return (
    <div className="flex flex-col min-h-screen bg-background text-white font-sans overflow-x-hidden">
      
      {/* HEADER / NAVBAR */}
      <header className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-white/5">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl w-full mx-auto">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-black italic tracking-tighter flex items-center drop-shadow-[0_0_10px_rgba(166,255,0,0.3)]">
              <span className="text-white">GX</span>
              <span className="text-primary">SHIFT</span>
            </div>
          </div>
          <a 
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 border border-primary text-primary px-5 py-2 rounded-full text-xs font-bold hover:bg-primary hover:text-black transition-all shadow-[0_0_10px_rgba(166,255,0,0.1)] hover:shadow-[0_0_20px_rgba(166,255,0,0.4)]"
          >
            ORDER VIA WHATSAPP
          </a>
        </div>
      </header>

      {/* KONTEN UTAMA (Client Component) */}
      <main className="flex-1 w-full">
        <LandingContent 
          levels={levels} 
          faqs={faqs} 
          testimonials={testimonials} 
          whatsappNumber={whatsappNumber} 
        />
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-[#030303] border-t border-white/5 pt-20 pb-8 px-4 flex flex-col items-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight text-center mb-2">
          Ready to Rank Up?
        </h2>
        <p className="text-gray-500 text-xs mb-8 text-center uppercase tracking-[0.3em]">
          Let our pros handle the grind.
        </p>
        
        <a 
          href={`https://wa.me/${whatsappNumber}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="relative flex items-center justify-center px-10 py-5 bg-primary text-black font-extrabold rounded-xl hover:bg-[#b5ff2b] transition-all shadow-[0_0_25px_rgba(166,255,0,0.3)] hover:scale-105 mb-16 overflow-hidden group"
        >
          <span className="relative z-10 flex items-center gap-2 text-lg">ORDER VIA WHATSAPP</span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
        </a>

        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center border-t border-white/10 pt-8 text-[10px] text-gray-600 font-bold uppercase tracking-widest">
          <div className="text-lg font-black italic tracking-tighter mb-4 md:mb-0">
            <span className="text-white">GX</span><span className="text-primary">SHIFT</span>
          </div>
          <div className="flex gap-6 mb-4 md:mb-0">
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          </div>
          <p>© 2026 GXSHIFT. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}