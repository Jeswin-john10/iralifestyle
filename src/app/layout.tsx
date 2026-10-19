import React, { Suspense } from 'react';
import type { Metadata, Viewport } from 'next';
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import SmoothScroll from '@/components/SmoothScroll';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import CustomerAuthModal from '@/components/CustomerAuthModal';
import CustomerProfileDrawer from '@/components/CustomerProfileDrawer';
import ScrollReveal from '@/components/ScrollReveal';

export const viewport: Viewport = {
  themeColor: '#1A1613',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://iralifestyle.com'),
  title: {
    default: 'IRA Lifestyle | Timeless Elegance For Every You - Designer Ethnic Wear',
    template: '%s | IRA Lifestyle',
  },
  description:
    'Handcrafted designer ethnic wear, royal anarkali dresses, festive kurtis, pure chiffon sarees & bespoke co-ord sets. Designed by Nikhil & Anju at IRA Lifestyle Studio, Guruvayoor & Thrissur, Kerala.',
  keywords: [
    'IRA Lifestyle',
    'IRA Lifestyle Guruvayoor',
    'IRA Lifestyle Thrissur',
    'designer ethnic wear',
    'luxury indian clothing',
    'anarkali dresses',
    'chiffon sarees',
    'embroidered kurtis',
    'ethnic co-ord sets',
    'kerala luxury boutique',
    'bridal couture india',
    'contemporary festive wear',
  ],
  authors: [{ name: 'IRA Lifestyle', url: 'https://iralifestyle.com' }],
  creator: 'IRA Lifestyle',
  publisher: 'IRA Lifestyle Studio',
  applicationName: 'IRA Lifestyle',
  category: 'fashion',
  alternates: {
    canonical: '/',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/icon.png',
  },
  openGraph: {
    title: 'IRA Lifestyle | Timeless Elegance For Every You',
    description:
      'Elegance In Every Thread. Premium handcrafted designer ethnic and contemporary clothing for the modern woman.',
    url: 'https://iralifestyle.com',
    siteName: 'IRA Lifestyle',
    images: [
      {
        url: '/images/hero_desktop.jpg',
        width: 1200,
        height: 630,
        alt: 'IRA Lifestyle Festive & Bridal Collection',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IRA Lifestyle | Luxury Ethnic & Festive Fashion',
    description:
      'Timeless Elegance For Every You. Shop bespoke handcrafted ethnic couture by Nikhil & Anju.',
    images: ['/images/hero_desktop.jpg'],
    creator: '@iralifestyle',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Structured Data: JSON-LD for Search Engines & AI Models */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'ClothingStore',
                  '@id': 'https://iralifestyle.com/#store',
                  name: 'IRA Lifestyle',
                  url: 'https://iralifestyle.com',
                  logo: 'https://iralifestyle.com/logo.png',
                  image: 'https://iralifestyle.com/images/hero_desktop.jpg',
                  description:
                    'Luxury Indian ethnic and contemporary women fashion atelier by Nikhil & Anju. Handcrafted dresses, kurtis, sarees, and co-ords.',
                  telephone: '+919995466002',
                  priceRange: '₹₹ - ₹₹₹',
                  currenciesAccepted: 'INR',
                  paymentAccepted: 'UPI, Credit Card, Debit Card, Net Banking',
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: 'East Nada, Near Temple',
                    addressLocality: 'Guruvayoor',
                    addressRegion: 'Kerala',
                    postalCode: '680101',
                    addressCountry: 'IN',
                  },
                  geo: {
                    '@type': 'GeoCoordinates',
                    latitude: '10.5946',
                    longitude: '76.0408',
                  },
                  founder: [
                    { '@type': 'Person', name: 'Nikhil' },
                    { '@type': 'Person', name: 'Anju' },
                  ],
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://iralifestyle.com/#website',
                  url: 'https://iralifestyle.com',
                  name: 'IRA Lifestyle',
                  publisher: { '@id': 'https://iralifestyle.com/#store' },
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: 'https://iralifestyle.com/shop?q={search_term_string}',
                    'query-input': 'required name=search_term_string',
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body>
        <AuthProvider>
          <CartProvider>
            <SmoothScroll>
              <ScrollReveal />
              <div className="d-flex flex-column min-vh-100">
                <Navbar />
                <main className="flex-grow-1">{children}</main>
                <Footer />
              </div>
              <CartDrawer />
              <CustomerAuthModal />
              <CustomerProfileDrawer />
            </SmoothScroll>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
