import type { Metadata } from 'next'
import { Inter } from "next/font/google"

import './globals.css'
import { AuthProvider } from '@/hooks/useAuth'
import { HospitalsProvider } from '@/hooks/useHospitals'
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'Golden 10 - Emergency Response Optimizer',
  description: 'AI-powered hospital routing and emergency coordination platform',
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
