import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'SneakersFest 2025 | The Ultimate Sneaker Culture Event',
  description: 'Join 10,000+ sneakerheads at the biggest sneaker event of the year. Browse, buy, sell, and celebrate sneaker culture. June 14-15, 2025 in Lagos.',
  keywords: 'sneakers, kicks, sneaker fest, sneaker event, Jordan, Nike, Yeezy, Lagos',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="pt-16 min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
