import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

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
        <Providers>
          <main className="grow flex flex-col">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}