import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ReactQueryProvider from '@/components/providers/ReactQueryProvider';
import BlastDoorOverlay from '@/components/ui/BlastDoorOverlay';
import { Toaster } from 'sonner';

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
      <body className={`${inter.variable} font-sans antialiased bg-[#0A0A0B] text-white min-h-screen flex flex-col selection:bg-[#A6FF00] selection:text-black`}>
        <ReactQueryProvider>
          <BlastDoorOverlay />
          <main className="flex-grow flex flex-col">
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