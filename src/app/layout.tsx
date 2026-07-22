import { type Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import { GeistSans } from 'geist/font/sans'

import { Providers } from '@/app/providers'
import { Layout } from '@/components/layout/Layout'
import { Analytics } from '@/components/analytics/analytics'
import { name, headline, introduction } from '@/config/infoConfig'
import { assetVersion } from '@/config/assets'
import {
  absoluteUrl,
  DEFAULT_SOCIAL_IMAGE_PATH,
  RSS_PATH,
  RSS_TITLE,
  SITE_URL,
} from '@/lib/seo'
import '@/styles/globals.css'

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: `%s - ${name}`,
    default: `${name} - ${headline}`,
  },
  description: `${introduction}`,
  manifest: `/manifest.json?v=${assetVersion}`,
  icons: {
    icon: [
      { url: `/favicon.svg?v=${assetVersion}`, type: 'image/svg+xml' },
      { url: `/favicon.ico?v=${assetVersion}`, sizes: 'any' },
      {
        url: `/favicon-32x32.png?v=${assetVersion}`,
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: `/favicon-16x16.png?v=${assetVersion}`,
        sizes: '16x16',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: `/apple-touch-icon.png?v=${assetVersion}`,
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
  alternates: {
    canonical: absoluteUrl('/'),
  },
  openGraph: {
    title: `${name} - ${headline}`,
    description: introduction,
    url: absoluteUrl('/'),
    type: 'website',
    siteName: name,
    locale: 'en_US',
    images: [
      {
        url: absoluteUrl(DEFAULT_SOCIAL_IMAGE_PATH),
        width: 1200,
        height: 630,
        alt: 'Reese — LLM inference and systems engineering',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${name} - ${headline}`,
    description: introduction,
    images: [absoluteUrl(DEFAULT_SOCIAL_IMAGE_PATH)],
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
        <link
          rel="alternate"
          type="application/rss+xml"
          title={RSS_TITLE}
          href={absoluteUrl(RSS_PATH)}
        />
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
        <meta
          name="theme-color"
          content="#eff1f5"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#1e1e2e"
          media="(prefers-color-scheme: dark)"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Reese Website" />
        <link
          rel="apple-touch-icon"
          href={`/apple-touch-icon.png?v=${assetVersion}`}
        />
      </head>
      <body className="flex h-full w-full overflow-x-hidden bg-background">
        <Providers>
          <div className="flex w-full min-w-0 overflow-x-hidden">
            <Layout>{children}</Layout>
          </div>
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}
