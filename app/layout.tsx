import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import SafeBlastDoor from '@/components/ui/SafeBlastDoor';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

// 1. Ekspor Viewport Khusus (Standar Next.js 14/15)
export const viewport: Viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, // Mencegah auto-zoom menjengkelkan saat user klik input form di Mobile
};

// 2. Metadata SEO & Social Media AAA
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'GXSHIFT | Premium Gaming Service Platform',
    template: '%s | GXSHIFT', // Otomatis mengubah title di halaman lain, misal: "Order | GXSHIFT"
  },
  description: 'Rank Up. Dominate. Be Legendary. Premium Mobile Legends boosting service with verified pro players.',
  keywords: ['gaming', 'boosting', 'mobile legends', 'rank boost', 'gxshift', 'joki ml', 'joki mobile legends'],
  authors: [{ name: 'GXSHIFT' }],
  creator: 'GXSHIFT',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: '/',
    title: 'GXSHIFT | Premium Gaming Service',
    description: 'Rank Up. Dominate. Be Legendary. Secure and fast rank boosting.',
    siteName: 'GXSHIFT',
    images: [
      {
        url: '/assets/og-image.jpg', // Pastikan file gambar ini ada di folder public/assets/
        width: 1200,
        height: 630,
        alt: 'GXSHIFT Banner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GXSHIFT | Premium Gaming Service',
    description: 'Rank Up. Dominate. Be Legendary.',
    images: ['/assets/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning wajib ada di Root untuk menghindari bentrok ekstensi browser
    <html lang="id" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-background text-white min-h-screen flex flex-col selection:bg-primary selection:text-black overflow-x-hidden`}>
        <Providers>
          {/* Animasi Loading Layar Baja */}
          <SafeBlastDoor />
          
          {/* Global Notification System (Sonner) */}
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

          {/* Konten Utama */}
          <main className="grow flex flex-col relative z-0">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}