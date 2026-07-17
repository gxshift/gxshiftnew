'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function BlastDoorOverlay() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    // Durasi total loading sebelum pintu terbuka (2.2 detik)
    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = 'unset';
    }, 2200);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="ufo-blast-door"
          className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
        >
          {/* TOP METAL DOOR */}
          <motion.div
            initial={{ y: 0 }}
            exit={{ 
              y: '-100%', 
              transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.3 } 
            }}
            className="absolute top-0 left-0 w-full h-1/2 bg-[#050505] border-b-[3px] border-primary shadow-[0_15px_50px_rgba(166,255,0,0.2)] pointer-events-auto z-20"
          >
            {/* Tekstur/Garis Pintu Mekanis */}
            <div className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          </motion.div>

          {/* BOTTOM METAL DOOR */}
          <motion.div
            initial={{ y: 0 }}
            exit={{ 
              y: '100%', 
              transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.3 } 
            }}
            className="absolute bottom-0 left-0 w-full h-1/2 bg-[#050505] border-t-[3px] border-primary shadow-[0_-15px_50px_rgba(166,255,0,0.2)] pointer-events-auto z-20"
          >
            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          </motion.div>

          {/* CENTER CONTENT (LOGO & BAR) */}
          <motion.div
            exit={{ 
              scale: 1.5, 
              opacity: 0, 
              filter: 'blur(15px)', 
              transition: { duration: 0.4, ease: 'easeIn' } 
            }}
            className="relative z-30 flex flex-col items-center pointer-events-auto"
          >
            {/* Ambient Glow di belakang logo */}
            <div className="absolute w-48 h-48 bg-primary/20 blur-[60px] rounded-full animate-pulse" />

            <motion.div
              animate={{
                y: [-4, 4, -4],
                scale: [0.99, 1.01, 0.99],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut"
              }}
              className="mb-8 relative"
            >
              <Image
                src="/loading-logo.webp"
                alt="GXSHIFT Initializing"
                width={150}
                height={150}
                priority
                className="drop-shadow-[0_0_15px_rgba(166,255,0,0.5)]"
              />
            </motion.div>

            {/* Progress Bar Futuristik */}
            <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden relative shadow-[0_0_10px_rgba(166,255,0,0.1)]">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{
                  duration: 1.8,
                  ease: "circOut"
                }}
                className="h-full bg-primary shadow-[0_0_15px_rgba(166,255,0,1)]"
              />
            </div>

            <motion.p
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="mt-6 text-primary text-[10px] tracking-[0.5em] font-black uppercase drop-shadow-[0_0_8px_rgba(166,255,0,0.8)]"
            >
              SYSTEM INITIALIZING
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}