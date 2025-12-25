import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { SessionProvider } from '@/components/providers/session-provider'
import { FeaturesProvider } from '@/lib/features-context'
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics'
import { AffiliateTracker } from '@/components/analytics/AffiliateTracker'

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BookingEngine - מנוע הזמנות למלונות",
  description: "מנוע הזמנות מקצועי להטמעה באתרי מלונות",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={'font-sans antialiased'}>
        <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''} />
        <AffiliateTracker />
        <SessionProvider>
          <FeaturesProvider>
            {children}
          </FeaturesProvider>
        </SessionProvider>
      </body>    </html>
  )
}
