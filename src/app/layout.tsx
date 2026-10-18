import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans, Alex_Brush } from 'next/font/google';
import './globals.css';
import { CartWishlistProvider } from '@/context/CartWishlistContext';
import SmoothScroll from '@/components/SmoothScroll';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import WishlistDrawer from '@/components/WishlistDrawer';
import SearchModal from '@/components/SearchModal';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const alexBrush = Alex_Brush({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-script',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'IRA LIFESTYLE | Timeless Elegance For Every You',
  description:
    'Crafted for the modern woman — graceful, confident and effortlessly stylish. Discover our latest collection of premium ethnic and contemporary wear.',
  keywords: [
    'IRA Lifestyle',
    'luxury ethnic wear',
    'designer anarkali',
    'chiffon sarees',
    'silk co-ord sets',
    'kurti set',
    'Indian wedding wear',
    'designer clothing',
  ],
  authors: [{ name: 'IRA Lifestyle' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'IRA LIFESTYLE | Timeless Elegance For Every You',
    description:
      'Crafted for the modern woman — graceful, confident and effortlessly stylish. Premium ethnic and contemporary clothing.',
    url: 'https://iralifestyle.com',
    siteName: 'IRA Lifestyle',
    images: [
      {
        url: '/images/hero-model.jpg',
        width: 1200,
        height: 675,
        alt: 'IRA Lifestyle - Timeless Elegance',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IRA LIFESTYLE | Timeless Elegance For Every You',
    description: 'Crafted for the modern woman — graceful, confident and effortlessly stylish.',
    images: ['/images/hero-model.jpg'],
  },
  icons: {
    icon: '/images/ira-logo.png',
    apple: '/images/ira-logo.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#FAF7F2',
  width: 'device-width',
  initialScale: 1,
};

import { Suspense } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${plusJakarta.variable} ${alexBrush.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1A1816] selection:bg-[#B68D56] selection:text-white">
        <CartWishlistProvider>
          <SmoothScroll>
            <Suspense fallback={<div className="h-20 bg-[#FAF7F2]" />}>
              <Navbar />
            </Suspense>
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
            <WishlistDrawer />
            <SearchModal />
          </SmoothScroll>
        </CartWishlistProvider>
      </body>
    </html>
  );
}
