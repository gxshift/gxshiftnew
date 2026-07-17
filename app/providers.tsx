"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import ReactQueryProvider from '@/components/providers/ReactQueryProvider';

// 1. Amputasi paksa dari Server (ssr: false)
const BlastDoorOverlay = dynamic(() => import('@/components/ui/BlastDoorOverlay'), { ssr: false });
const Toaster = dynamic(() => import('sonner').then(mod => mod.Toaster), { ssr: false });

export function Providers({ children }: { children: React.ReactNode }) {
  // 2. State untuk mendeteksi apakah kita sudah berada di dalam Browser
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <ReactQueryProvider>
      {/* 3. Animasi hanya boleh dirender JIKA sudah berada di Browser */}
      {isMounted && <BlastDoorOverlay />}
      
      {children}
      
      {/* 4. Notifikasi juga hanya boleh dirender di Browser */}
      {isMounted && (
        <Toaster 
          theme="dark" 
          position="top-center"
          toastOptions={{
            style: {
              background: 'rgba(20, 20, 22, 0.9)',
              border: '1px solid rgba(166, 255, 0, 0.2)',
              color: '#fff',
              backdropFilter: 'blur(10px)',
            }
          }}
        />
      )}
    </ReactQueryProvider>
  );
}