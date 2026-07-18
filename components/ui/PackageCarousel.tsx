'use client';

import React, { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Trophy, Zap, Clock, X, Send, User, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { Level } from '@/types';

// Inisialisasi Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface PackageCarouselProps {
  levels: Level[];
  whatsappNumber: string;
}

export default function PackageCarousel({ levels, whatsappNumber }: PackageCarouselProps) {
  const [selectedPackage, setSelectedPackage] = useState<Level | null>(null);
  
  // STATE FORM
  const [customerName, setCustomerName] = useState('');
  const [waNumber, setWaNumber] = useState(''); // State Baru untuk No WA
  const [isSubmitting, setIsSubmitting] = useState(false);

  const uniqueGames = Array.from(new Map(levels.map((level) => [level.games?.id, level.games])).values()).filter((game): game is NonNullable<Level['games']> => game !== undefined && game !== null);
  const [activeGameId, setActiveGameId] = useState<string | null>(null);

  useEffect(() => {
    if (uniqueGames.length > 0 && uniqueGames[0] && !activeGameId) setActiveGameId(uniqueGames[0].id);
  }, [uniqueGames, activeGameId]);

  const filteredLevels = levels.filter((level) => level.game_id === activeGameId);
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps', dragFree: true });
  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const formatRupiah = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);

  // FUNGSI CHECKOUT & SIMPAN KE DATABASE
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !waNumber.trim() || !selectedPackage) return;
    
    setIsSubmitting(true);
    try {
      // 1. Simpan ke Database (Dasbor admin membaca dari sini)
      const { error } = await supabase.from('orders').insert([{
        customer_name: customerName,
        nickname: customerName,
        whatsapp_number: waNumber,
        game_id: selectedPackage.game_id,
        level_id: selectedPackage.id,
        total_price: selectedPackage.price,
        status: 'pending'
      }]);

      if (error) throw error;

      // 2. Redirect ke WhatsApp
      const text = `Halo Admin GXSHIFT! 🚀%0A%0ASaya ingin order grinding untuk game *${selectedPackage.games?.name}*.%0A%0A*Detail Pesanan:*%0A👤 Nickname: *${customerName}*%0A📱 No WA: *${waNumber}*%0A- Target: *${selectedPackage.name} (${selectedPackage.sub_level})*%0A- Harga: *${formatRupiah(selectedPackage.price)}*%0A%0AMohon panduan untuk pembayarannya.`;
      window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');

      // 3. Reset Form
      setSelectedPackage(null);
      setCustomerName('');
      setWaNumber('');
    } catch (error) {
      alert("Terjadi kesalahan sistem. Pastikan RLS Supabase tabel 'orders' mengizinkan INSERT publik.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!levels || levels.length === 0) return <div className="text-center text-gray-500 py-10">Belum ada paket tersedia.</div>;

  return (
    <div className="w-full relative px-4 sm:px-12 max-w-[1400px] mx-auto">
      {/* TABS GAME */}
      {uniqueGames.length > 0 && (
        <div className="flex justify-center gap-3 mb-10 overflow-x-auto pb-4 no-scrollbar">
          {uniqueGames.map((game) => (
            <button key={game.id} onClick={() => setActiveGameId(game.id)} className={`px-8 py-3 rounded-full font-bold text-xs uppercase tracking-[0.15em] transition-all whitespace-nowrap border ${ activeGameId === game.id ? 'bg-primary text-black border-primary shadow-[0_0_20px_rgba(166,255,0,0.3)]' : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white' }`}>
              {game.name}
            </button>
          ))}
        </div>
      )}

      {/* CAROUSEL */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6 pb-8 pt-4">
          {filteredLevels.map((level) => (
            <div key={level.id} className="flex-[0_0_100%] sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)] xl:flex-[0_0_calc(25%-18px)] min-w-0">
              <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col items-center relative overflow-hidden bg-[#0a0a0a] group hover:border-primary/50 transition-colors duration-300">
                <div className="absolute top-4 right-4 bg-white/5 text-gray-300 text-[8px] px-2.5 py-1 rounded-full border border-white/10 uppercase tracking-widest font-bold group-hover:bg-primary/10 group-hover:text-primary transition-all">
                  {level.games?.name}
                </div>
                <h3 className="text-2xl font-black italic text-white mt-4 uppercase tracking-tight">{level.name}</h3>
                <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-6">{level.sub_level}</p>
                
                {/* LOGIKA TAMPILAN ICON GAMBAR / PIALA */}
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 transition-transform duration-500 overflow-hidden relative">
                  {level.icon_url ? (
                    <img 
                      src={level.icon_url} 
                      alt={level.name} 
                      className="w-16 h-16 object-contain drop-shadow-[0_0_15px_rgba(166,255,0,0.3)]" 
                    />
                  ) : (
                    <Trophy className="text-gray-500 group-hover:text-primary transition-colors" size={40} strokeWidth={1.5} />
                  )}
                </div>

                <div className="w-full flex justify-between items-end border-t border-white/10 pt-4 mb-6">
                  <div className="flex flex-col"><span className="text-[9px] text-gray-500 uppercase flex items-center gap-1 tracking-wider"><Clock size={10} /> Estimasi</span><span className="text-sm font-bold text-white mt-0.5">{level.estimated_time}</span></div>
                  <div className="flex flex-col text-right"><span className="text-[9px] text-gray-500 uppercase flex items-center justify-end gap-1 tracking-wider"><Zap size={10} /> Start From</span><span className="text-xl font-black text-primary mt-0.5">{formatRupiah(level.price)}</span></div>
                </div>
                <button onClick={() => setSelectedPackage(level)} className="w-full py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all text-center flex items-center justify-center gap-2">
                  Order Sekarang
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={scrollPrev} className="absolute left-0 top-[60%] -translate-y-1/2 w-12 h-12 bg-[#050505] border border-primary/30 rounded-full hidden sm:flex items-center justify-center text-primary hover:bg-primary hover:text-black transition-all z-10"><ChevronLeft size={24} /></button>
      <button onClick={scrollNext} className="absolute right-0 top-[60%] -translate-y-1/2 w-12 h-12 bg-[#050505] border border-primary/30 rounded-full hidden sm:flex items-center justify-center text-primary hover:bg-primary hover:text-black transition-all z-10"><ChevronRight size={24} /></button>

      {/* MODAL */}
      <AnimatePresence>
        {selectedPackage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedPackage(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-[#0a0a0a] border border-primary/30 rounded-2xl shadow-[0_0_40px_rgba(166,255,0,0.15)] overflow-hidden z-[101]">
              <div className="flex justify-between items-center p-5 border-b border-white/10 bg-black/40">
                <h3 className="text-lg font-black italic tracking-tight text-white flex items-center gap-2"><span className="text-primary">CONFIRM</span> ORDER</h3>
                <button onClick={() => setSelectedPackage(null)} className="text-gray-400 hover:text-primary transition-colors"><X size={20} /></button>
              </div>

              <form onSubmit={handleCheckout} className="p-6">
                <div className="mb-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Target Boost</p>
                  <p className="text-lg font-black text-white">{selectedPackage.name} <span className="text-sm font-normal text-gray-400">({selectedPackage.sub_level})</span></p>
                  <p className="text-primary font-bold mt-1">{formatRupiah(selectedPackage.price)}</p>
                </div>

                <div className="space-y-2 mb-4">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nickname / Game ID</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500"><User size={16} /></div>
                    <input type="text" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:border-primary text-white" placeholder="Cth: RRQ Lemon" />
                  </div>
                </div>

                <div className="space-y-2 mb-8">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nomor WhatsApp</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500"><Phone size={16} /></div>
                    <input type="tel" required value={waNumber} onChange={(e) => setWaNumber(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:border-primary text-white" placeholder="Cth: 08123456789" />
                  </div>
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-primary text-black font-extrabold rounded-xl hover:bg-[#b5ff2b] transition-all flex items-center justify-center gap-2 text-sm uppercase group">
                  {isSubmitting ? 'MEMPROSES...' : 'ORDER SEKARANG'}
                  {!isSubmitting && <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}