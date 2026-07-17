"use client";

import React from 'react';
import ReactQueryProvider from '@/components/providers/ReactQueryProvider';
import BlastDoorOverlay from '@/components/ui/BlastDoorOverlay';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <BlastDoorOverlay />
      {children}
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
    </ReactQueryProvider>
  );
}