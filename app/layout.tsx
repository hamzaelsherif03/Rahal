import type React from "react"
import { DM_Serif_Display, DM_Sans } from "next/font/google"
import "./globals.css"

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
  weight: ["400"],
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
})

export const metadata = {
  title: {
    default: "Rahal - Luxury Pleated Skirts Collection | Premium Designer Skirts",
    template: "%s | Rahal",
  },
  description:
    "Experience SKIRTÉ's exclusive collection of ultra-luxury skirts, meticulously crafted from the world's finest materials. Timeless elegance meets contemporary sophistication. Complimentary shipping worldwide.",
  keywords: [
    "ultra-luxury skirts",
    "couture fashion",
    "premium women's clothing",
    "luxury designer skirts",
    "high-end fashion",
    "exclusive fashion atelier",
    "luxury fashion house",
    "premium materials",
    "timeless elegance",
  ],
  authors: [{ name: "SKIRTÉ Atelier" }],
  creator: "SKIRTÉ",
  publisher: "SKIRTÉ",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "SKIRTÉ - Luxury Pleated Skirts Collection",
    description:
      "Discover the epitome of luxury fashion with SKIRTÉ's exclusive collection. Each piece embodies timeless elegance and exceptional craftsmanship for the discerning woman.",
    siteName: "SKIRTÉ",
  },
  twitter: {
    card: "summary_large_image",
    title: "SKIRTÉ - Ultra-Luxury Fashion Atelier",
    description: "Timeless elegance meets contemporary sophistication. Discover our exclusive collection.",
    creator: "@skirte_atelier",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${dmSerifDisplay.variable} ${dmSans.variable} antialiased`}>
      <head>
        <link rel="icon" href="/rahal-logo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/rahal-logo.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/rahal-logo.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/rahal-logo.png" />
        <meta name="theme-color" content="#1f2937" />
        <meta name="msapplication-TileColor" content="#1f2937" />
      </head>
      <body className="font-body">{children}</body>
    </html>
  )
}
