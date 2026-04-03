import type { Metadata } from 'next'
import { Geist, Geist_Mono, Sacramento } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const _sacramento = Sacramento({ weight: '400', subsets: ["latin"], variable: "--font-sacramento" });

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
      <body className={`font-sans antialiased ${_sacramento.variable}`}>
        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-PSN3QHLRBY" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PSN3QHLRBY');
          `}
        </Script>
        
        {/* Microsoft Clarity */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "vz9zq9ks05");
          `}
        </Script>

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
