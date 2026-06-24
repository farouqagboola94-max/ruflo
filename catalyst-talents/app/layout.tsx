import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import RevealObserver from '@/components/RevealObserver'

export const metadata: Metadata = {
  title: 'Catalyst Talents Lagos | Premier Modelling & Talent Agency',
  description:
    'Catalyst Talents Lagos — Illuminating models and talents in Lagos, Nigeria. Fashion, commercial, influencer, and acting representation.',
  keywords: [
    'modelling agency Lagos',
    'Nigerian models',
    'Catalyst Talents',
    'Lagos fashion',
    'talent management Nigeria',
    'Catalyst Concepts',
  ],
  icons: {
    icon: '/catalyst-logo.svg',
    shortcut: '/catalyst-logo.svg',
    apple: '/catalyst-logo.svg',
  },
  openGraph: {
    title: 'Catalyst Talents Lagos',
    description: "Where Lagos Meets the World's Runways",
    type: 'website',
    images: [
      {
        url: '/catalyst-logo.svg',
        width: 600,
        height: 380,
        alt: 'Catalyst Talents Lagos — A Division of Catalyst Concepts',
      },
    ],
  },
  twitter: {
    card: 'summary',
    site: '@Catalyst188',
    creator: '@Catalyst188',
    title: 'Catalyst Talents Lagos',
    description: "Where Lagos Meets the World's Runways",
    images: ['/catalyst-logo.svg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
        <RevealObserver />
      </body>
    </html>
  )
}
