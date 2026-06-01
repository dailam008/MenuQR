import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { GoogleAnalytics } from './components/GoogleAnalytics'

const APP_URL = 'https://menuqr.vercel.app'
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || ''

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'MenuQR — Menu Digital QR Code untuk Warung & Restoran Indonesia',
    template: '%s | MenuQR',
  },
  description:
    'Buat menu digital profesional dengan QR code untuk warung & restoran UMKM Indonesia. Gratis 1 outlet selamanya. Setup hanya 5 menit, tanpa install aplikasi.',
  keywords: [
    'menu digital warung',
    'QR code menu',
    'QR code menu UMKM Indonesia',
    'menu restoran digital',
    'menu digital gratis',
    'aplikasi menu warung',
    'menu online UMKM',
    'scan menu QR',
  ],
  authors: [{ name: 'MenuQR', url: APP_URL }],
  creator: 'MenuQR',
  publisher: 'MenuQR',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: APP_URL,
    siteName: 'MenuQR',
    title: 'MenuQR — Menu Digital QR Code untuk Warung & Restoran',
    description:
      'Buat menu digital dengan QR code dalam 5 menit. Gratis untuk 1 outlet. Pelanggan scan, langsung lihat menu — tanpa install app.',
    images: [
      {
        url: `${APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'MenuQR — Menu Digital untuk Warung Indonesia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MenuQR — Menu Digital QR Code untuk Warung & Restoran',
    description: 'Buat menu digital dengan QR code dalam 5 menit. Gratis untuk 1 outlet.',
    images: [`${APP_URL}/og-image.png`],
  },
  alternates: {
    canonical: APP_URL,
  },
}

const softwareAppJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'MenuQR',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: APP_URL,
  description:
    'Platform menu digital dengan QR code untuk warung dan restoran UMKM Indonesia.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'IDR',
    description: 'Gratis 1 outlet selamanya',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '500',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(softwareAppJsonLd).replace(/</g, '\\u003c'),
          }}
        />
      </head>
      <body>
        {children}
        {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
      </body>
    </html>
  )
}
