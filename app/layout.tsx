import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import dynamic from 'next/dynamic';

// --- OPTION B (Netlify AI Solution) ---
// Memuat komponen visual secara dinamis dan mematikan SSR (Server-Side Rendering)
const BlastDoorOverlay = dynamic(() => import('@/components/ui/BlastDoorOverlay'), { ssr: false });
const Toaster = dynamic(() => import('sonner').then((mod) => mod.Toaster), { ssr: false });

// Provider dibiarkan standar, tapi PASTIKAN di file ReactQueryProvider.tsx sudah ada "use client";
import ReactQueryProvider from '@/components/providers/ReactQueryProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'GXSHIFT | Premium Gaming Service Platform',
  description: 'Rank Up. Dominate. Be Legendary. Premium Mobile Legends boosting service.',
  keywords: ['gaming', 'boosting', 'mobile legends', 'rank boost', 'gxshift'],
  openGraph: {
    title: 'GXSHIFT | Premium Gaming Service',
    description: 'Rank Up. Dominate. Be Legendary.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-background text-white min-h-screen flex flex-col selection:bg-primary selection:text-black`}>
        <ReactQueryProvider>
          <BlastDoorOverlay />
          <main className="grow flex flex-col">
            {children}
          </main>
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
      </body>
    </html>
  );
}