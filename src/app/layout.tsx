import { type Metadata } from "next"
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"

import { Providers } from "@/app/providers"
import { Layout } from "@/components/layout/Layout"
import { Analytics } from "@/components/analytics/analytics"
import { name, headline, introduction } from "@/config/infoConfig"
import "@/styles/tailwind.css"

export const metadata: Metadata = {
  title: {
    template: `%s - ${name}`,
    default:
      `${name} - ${headline}`,
  },
  description:
    `${introduction}`,
  manifest: "/manifest.json?v=20260629",
  icons: {
    icon: [
      { url: "/favicon.ico?v=20260629", sizes: "any" },
      { url: "/favicon.svg?v=20260629", type: "image/svg+xml" },
      { url: "/favicon-32x32.png?v=20260629", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png?v=20260629", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png?v=20260629", sizes: "180x180", type: "image/png" },
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
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="manifest" href="/manifest.json?v=20260629" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Reese Website" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=20260629" />
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
