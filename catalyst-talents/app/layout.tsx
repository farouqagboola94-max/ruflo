import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

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
  openGraph: {
    title: 'Catalyst Talents Lagos',
    description: 'Where Lagos Meets the World\'s Runways',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
