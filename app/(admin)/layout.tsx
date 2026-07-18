import React from 'react';
import type { Metadata } from 'next';
import AdminSidebar from '@/components/layouts/AdminSidebar';
import { Providers } from '../providers';
import ClientAuthGuard from '@/components/auth/ClientAuthGuard';

export const metadata: Metadata = {
  title: 'GXSHIFT | Admin Command Center',
  description: 'Control panel for GXSHIFT Platform',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#020202] text-white overflow-hidden font-sans selection:bg-primary selection:text-black">
      {/* 🛡️ SATPAM CLIENT-SIDE AKTIF DI SINI */}
      <ClientAuthGuard>
        <Providers>
          <AdminSidebar />
          
          <main className="flex-1 overflow-y-auto relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
            <div className="p-4 md:p-8 min-h-full">
              {children}
            </div>
          </main>
        </Providers>
      </ClientAuthGuard>
    </div>
  );
}