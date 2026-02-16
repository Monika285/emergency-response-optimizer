import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'
import { AuthProvider } from '@/hooks/useAuth'
import { HospitalsProvider } from '@/hooks/useHospitals'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Golden 10 - Emergency Response Optimizer',
  description: 'AI-powered hospital routing and emergency coordination platform',
  generator: 'v0.app',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased dark">
        <AuthProvider>
          <HospitalsProvider>{children}</HospitalsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
