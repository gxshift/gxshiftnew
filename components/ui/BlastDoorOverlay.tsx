'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function BlastDoorOverlay() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Kunci scroll saat loading
    document.body.style.overflow = 'hidden';

    // Durasi loading animasi (1.8 detik)
    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = 'unset';
    }, 1800);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
        >
          <div className="relative flex flex-col items-center">
            
            {/* Glow Effect */}
            <div className="absolute w-40 h-40 bg-primary/20 blur-[50px] rounded-full animate-pulse" />

            {/* Logo Bouncing Animation */}
            <motion.div
              animate={{
                y: [-5, 5, -5],
                scale: [0.98, 1.02, 0.98],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
              }}
              className="mb-8 relative z-10"
            >
              <Image
                src="/loading-logo.webp"
                alt="GXSHIFT Loading"
                width={150}
                height={150}
                priority
              />
            </motion.div>

            {/* Loading Bar */}
            <div className="w-56 h-1.5 bg-white/5 rounded-full overflow-hidden relative z-10">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{
                  duration: 1.5,
                  ease: "easeInOut"
                }}
                className="h-full bg-primary"
              />
            </div>

            {/* Loading Text */}
            <motion.p
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
              }}
              className="mt-6 text-primary text-xs tracking-[0.4em] relative z-10 font-bold"
            >
              INITIALIZING SYSTEM
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}