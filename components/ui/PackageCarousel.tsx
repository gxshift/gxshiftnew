'use client';

import React, { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Trophy, Zap, Clock } from 'lucide-react';
import { Level } from '@/types';

interface PackageCarouselProps {
  levels: Level[];
  whatsappNumber: string;
}

export default function PackageCarousel({ levels, whatsappNumber }: PackageCarouselProps) {
  // 1. Ekstrak Game unik & Type Guard agar TypeScript tahu 'game' tidak mungkin undefined
  const uniqueGames = Array.from(
    new Map(levels.map((level) => [level.games?.id, level.games])).values()
  ).filter((game): game is NonNullable<Level['games']> => game !== undefined && game !== null);

  // 2. Set Game pertama sebagai Tab aktif secara default
  const [activeGameId, setActiveGameId] = useState<string | null>(null);

  useEffect(() => {
    // Tambahan uniqueGames[0] untuk memastikan objek benar-benar ada sebelum mengambil .id
    if (uniqueGames.length > 0 && uniqueGames[0] && !activeGameId) {
      setActiveGameId(uniqueGames[0].id);
    }
  }, [uniqueGames, activeGameId]);

  // 3. Filter levels sesuai Tab Game yang sedang diklik
  const filteredLevels = levels.filter((level) => level.game_id === activeGameId);

  // 4. Setup Embla Carousel
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
  });

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  // Format Rupiah
  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Generate WhatsApp Link
  const createWaLink = (level: Level) => {
    const text = `Halo Admin GXSHIFT!%0A%0ASaya ingin order joki untuk game *${level.games?.name}*.%0A%0A*Detail Pesanan:*%0A- Target: *${level.name} (${level.sub_level})*%0A- Harga: *${formatRupiah(level.price)}*%0A%0AMohon info ketersediaan slotnya. Terima kasih!`;
    return `https://wa.me/${whatsappNumber}?text=${text}`;
  };

  if (!levels || levels.length === 0) {
    return <div className="text-center text-gray-500 py-10">Belum ada paket yang tersedia.</div>;
  }

  return (
    <div className="w-full relative px-4 sm:px-12 max-w-[1400px] mx-auto">
      
      {/* TABS KATEGORI GAME */}
      {uniqueGames.length > 0 && (
        <div className="flex justify-center gap-3 mb-10 overflow-x-auto pb-4 no-scrollbar">
          {uniqueGames.map((game) => (
            <button
              key={game.id}
              onClick={() => setActiveGameId(game.id)}
              className={`px-8 py-3 rounded-full font-bold text-xs uppercase tracking-[0.15em] transition-all whitespace-nowrap border ${
                activeGameId === game.id
                  ? 'bg-primary text-black border-primary shadow-[0_0_20px_rgba(166,255,0,0.3)]'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              {game.name}
            </button>
          ))}
        </div>
      )}

      {/* CAROUSEL WRAPPER */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6 pb-8 pt-4">
          {filteredLevels.map((level) => (
            <div
              key={level.id}
              className="flex-[0_0_100%] sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)] xl:flex-[0_0_calc(25%-18px)] min-w-0"
            >
              {/* CARD PRODUK */}
              <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col items-center relative overflow-hidden bg-[#0a0a0a] group hover:border-primary/50 transition-colors duration-300">
                
                {/* Badge Nama Game */}
                <div className="absolute top-4 right-4 bg-white/5 text-gray-300 text-[8px] px-2.5 py-1 rounded-full border border-white/10 uppercase tracking-widest font-bold group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-all">
                  {level.games?.name}
                </div>

                <h3 className="text-2xl font-black italic text-white mt-4 uppercase tracking-tight">
                  {level.name}
                </h3>
                <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-6">
                  {level.sub_level}
                </p>

                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                  <Trophy className="text-gray-500 group-hover:text-primary transition-colors" size={40} strokeWidth={1.5} />
                </div>

                <div className="w-full flex justify-between items-end border-t border-white/10 pt-4 mb-6">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-gray-500 uppercase flex items-center gap-1 tracking-wider">
                      <Clock size={10} /> Estimasi
                    </span>
                    <span className="text-sm font-bold text-white mt-0.5">{level.estimated_time}</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-[9px] text-gray-500 uppercase flex items-center justify-end gap-1 tracking-wider">
                      <Zap size={10} /> Start From
                    </span>
                    <span className="text-xl font-black text-primary mt-0.5">{formatRupiah(level.price)}</span>
                  </div>
                </div>

                <a
                  href={createWaLink(level)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all text-center flex items-center justify-center gap-2"
                >
                  Order Sekarang
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NAVIGASI CAROUSEL (Konflik CSS Tailwind diselesaikan dengan menghapus base 'flex') */}
      <button
        onClick={scrollPrev}
        className="absolute left-0 top-[60%] -translate-y-1/2 w-12 h-12 bg-[#050505] border border-primary/30 rounded-full hidden sm:flex items-center justify-center text-primary hover:bg-primary hover:text-black transition-all shadow-[0_0_15px_rgba(166,255,0,0.1)] hover:scale-110 z-10"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-0 top-[60%] -translate-y-1/2 w-12 h-12 bg-[#050505] border border-primary/30 rounded-full hidden sm:flex items-center justify-center text-primary hover:bg-primary hover:text-black transition-all shadow-[0_0_15px_rgba(166,255,0,0.1)] hover:scale-110 z-10"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}