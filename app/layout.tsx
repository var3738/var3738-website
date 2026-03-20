import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: '%s | VAR 37/38 - The Voice of a Generation',
    default: 'VAR 37/38 | Reclaiming Youth Power in Kenya',
  },
  description: "Institutionalizing youth participation in Kenya's electoral processes. VAR 37/38 bridges the gap between grassroots street activism and formal democratic governance through ideology and technology.",
  keywords: ['VAR 37/38', 'Kenya Youth Democracy', 'Uamuzi Platform', 'Trans Nzoia Townhall', 'From the Streets to the Ballot', 'Civic Tech Kenya', 'Art 37 Kenya', 'Art 38 Kenya'],
  authors: [{ name: 'VAR 37/38' }],
  metadataBase: new URL('https://var3738.org'), // Placeholder URL, should be updated to actual domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'VAR 37/38 | Reclaiming Youth Power in Kenya',
    description: "Institutionalizing youth participation in Kenya's electoral processes.",
    url: 'https://var3738.org',
    siteName: 'VAR 37/38',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'VAR 37/38 - Youth Power in Kenya',
      },
    ],
    locale: 'en_KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VAR 37/38 | Reclaiming Youth Power in Kenya',
    description: "Institutionalizing youth participation in Kenya's electoral processes.",
    images: ['/og-image.png'],
    creator: '@VAR3738', // Placeholder handle
  },
  icons: {
    icon: '/icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
