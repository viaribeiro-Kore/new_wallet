import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Safe Swap - 0x API + Safe Wallet',
  description: 'Professional swap interface with 0x API integration and Safe Wallet execution',
  keywords: ['swap', 'defi', 'safe wallet', '0x', 'ethereum'],
  authors: [{ name: 'Safe Swap Team' }],
  openGraph: {
    title: 'Safe Swap',
    description: 'Professional swap interface with 0x API integration',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen bg-background text-foreground">
          {children}
        </div>
      </body>
    </html>
  )
}