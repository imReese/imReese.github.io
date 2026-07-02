import { type Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import { GeistSans } from "geist/font/sans"

import { Providers } from "@/app/providers"
import { Layout } from "@/components/layout/Layout"
import { Analytics } from "@/components/analytics/analytics"
import { name, headline, introduction } from "@/config/infoConfig"
import { assetVersion } from "@/config/assets"
import "@/styles/globals.css"

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
})

export const metadata: Metadata = {
  title: {
    template: `%s - ${name}`,
    default:
      `${name} - ${headline}`,
  },
  description:
    `${introduction}`,
  manifest: `/manifest.json?v=${assetVersion}`,
  icons: {
    icon: [
      { url: `/favicon.svg?v=${assetVersion}`, type: "image/svg+xml" },
      { url: `/favicon.ico?v=${assetVersion}`, sizes: "any" },
      { url: `/favicon-32x32.png?v=${assetVersion}`, sizes: "32x32", type: "image/png" },
      { url: `/favicon-16x16.png?v=${assetVersion}`, sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: `/apple-touch-icon.png?v=${assetVersion}`, sizes: "180x180", type: "image/png" },
    ],
  },
  alternates: {
    types: {
      'application/rss+xml': `${process.env.NEXT_PUBLIC_SITE_URL}/feed`,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${jetBrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="manifest" href={`/manifest.json?v=${assetVersion}`} />
        <link
          rel="icon"
          href={`/favicon-light.svg?v=${assetVersion}`}
          type="image/svg+xml"
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="icon"
          href={`/favicon-dark.svg?v=${assetVersion}`}
          type="image/svg+xml"
          media="(prefers-color-scheme: dark)"
        />
        <meta name="theme-color" content="#eff1f5" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1e1e2e" media="(prefers-color-scheme: dark)" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Reese Website" />
        <link rel="apple-touch-icon" href={`/apple-touch-icon.png?v=${assetVersion}`} />
      </head>
      <body className="flex h-full w-full overflow-x-hidden bg-background">
        <Providers>
          <div className="flex min-w-0 w-full overflow-x-hidden">
            <Layout>{children}</Layout>
          </div>
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}
