'use client';

import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Trophy, Zap, Clock } from 'lucide-react';
import { Level } from '@/types';
import Link from 'next/link';

interface PackageCarouselProps {
  levels: Level[];
  whatsappNumber: string;
}

export default function PackageCarousel({ levels, whatsappNumber }: PackageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start',
    loop: false,
    dragFree: true
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (!levels || levels.length === 0) {
    return <div className="text-center text-gray-500 py-10">Belum ada paket yang tersedia.</div>;
  }

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4">
      {/* Tombol Navigasi Kiri */}
      <button 
        onClick={scrollPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-6 z-10 w-12 h-12 bg-black/80 border border-primary/50 text-primary rounded-full flex items-center justify-center hover:bg-primary hover:text-black transition-all shadow-[0_0_15px_rgba(166,255,0,0.2)] backdrop-blur-md hidden md:flex"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Embla Viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex backface-hidden touch-pan-y gap-4 md:gap-6 py-8">
          {levels.map((level, index) => (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="relative flex-[0_0_100%] sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(25%-18px)] min-w-0"
            >
              <div className="glass-panel p-6 rounded-2xl h-full flex flex-col items-center text-center border border-white/5 hover:border-primary/50 transition-colors group relative overflow-hidden">
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                {/* Dynamic/Popular Badge */}
                {level.price === 0 && (
                  <div className="absolute top-0 right-0 bg-primary text-black text-[9px] font-black px-4 py-1 rounded-bl-xl uppercase tracking-widest shadow-[0_0_10px_rgba(166,255,0,0.5)]">
                    Custom Order
                  </div>
                )}

                <h3 className="text-xl font-black text-white italic mb-1 uppercase tracking-tight mt-4">
                  {level.name}
                </h3>
                <p className="text-xs text-primary font-medium mb-6 uppercase tracking-widest">
                  {level.sub_level || 'All Tiers'}
                </p>
                
                <div className="w-28 h-28 mb-6 bg-black/50 border border-white/10 rounded-full flex items-center justify-center group-hover:shadow-[0_0_30px_rgba(166,255,0,0.2)] transition-all">
                  {level.icon_url ? (
                    <img src={level.icon_url} alt={level.name} className="w-20 h-20 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
                  ) : (
                    <Trophy className="w-12 h-12 text-gray-600 group-hover:text-primary transition-colors" />
                  )}
                </div>

                <div className="w-full flex justify-between items-end border-b border-white/10 pb-4 mb-6 mt-auto">
                  <div className="text-left flex flex-col gap-1">
                    <span className="flex items-center gap-1 text-[10px] text-gray-500 uppercase tracking-wider">
                      <Clock size={12} /> Estimasi
                    </span>
                    <p className="text-sm font-bold text-gray-300">{level.estimated_time}</p>
                  </div>
                  <div className="text-right flex flex-col gap-1">
                    <span className="flex items-center justify-end gap-1 text-[10px] text-gray-500 uppercase tracking-wider">
                      <Zap size={12} /> Start From
                    </span>
                    <p className={`font-black text-primary ${level.price === 0 ? 'text-lg' : 'text-xl'}`}>
                      {level.price === 0 ? 'DYNAMIC' : `Rp ${level.price.toLocaleString('id-ID')}`}
                    </p>
                  </div>
                </div>
                
                <Link 
                  href={`/order?level=${level.id}`}
                  className="w-full py-3.5 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-primary hover:text-black hover:border-primary transition-all flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_rgba(166,255,0,0.3)] z-10"
                >
                  ORDER SEKARANG
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tombol Navigasi Kanan */}
      <button 
        onClick={scrollNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-6 z-10 w-12 h-12 bg-black/80 border border-primary/50 text-primary rounded-full flex items-center justify-center hover:bg-primary hover:text-black transition-all shadow-[0_0_15px_rgba(166,255,0,0.2)] backdrop-blur-md hidden md:flex"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}