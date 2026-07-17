import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
// KUNCI PERBAIKAN: Ubah import ke BlastDoorOverlay
import BlastDoorOverlay from '@/components/ui/BlastDoorOverlay';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const viewport: Viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, 
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'GXSHIFT | Premium Gaming Service Platform',
    template: '%s | GXSHIFT', 
  },
  description: 'Rank Up. Dominate. Be Legendary. Premium Mobile Legends boosting service.',
  keywords: ['gaming', 'boosting', 'mobile legends', 'rank boost', 'gxshift'],
  authors: [{ name: 'GXSHIFT' }],
  creator: 'GXSHIFT',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: '/',
    title: 'GXSHIFT | Premium Gaming Service',
    description: 'Rank Up. Dominate. Be Legendary.',
    siteName: 'GXSHIFT',
    images: [{ url: '/assets/og-image.jpg', width: 1200, height: 630, alt: 'GXSHIFT Banner' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-background text-white min-h-screen flex flex-col selection:bg-primary selection:text-black overflow-x-hidden`}>
        <Providers>
          {/* KUNCI PERBAIKAN: Panggil BlastDoorOverlay di sini */}
          <BlastDoorOverlay />
          
          <Toaster 
            position="top-center"
            richColors
            toastOptions={{
              style: {
                background: '#050505',
                color: '#fff',
                border: '1px solid rgba(166,255,0,0.2)',
                boxShadow: '0 0 20px rgba(166,255,0,0.1)',
              },
              className: 'font-sans font-bold tracking-wide'
            }} 
          />

          <main className="grow flex flex-col relative z-0">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}