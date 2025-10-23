import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { SvgAttributeFixer } from '../components/SvgAttributeFixer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FuMu - AI Movie Creation App',
  description: 'Transform your creative ideas into cinematic masterpieces with AI-powered video generation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <SvgAttributeFixer />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
