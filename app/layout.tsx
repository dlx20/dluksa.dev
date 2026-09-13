import type { Metadata, Viewport } from 'next'
import { Ubuntu_Mono } from 'next/font/google'
import Header from '@/components/Header'
import JsonLd from '@/components/JsonLd'
import ThemeProvider from '@/components/ThemeProvider'
import TerminalFooter from '@/components/TerminalFooter'
import { getProjects } from '@/lib/github'
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  siteJsonLd,
  siteUrl,
  siteVerification,
} from '@/lib/seo'
import './globals.css'

const ubuntuMono = Ubuntu_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-ubuntu-mono',
  display: 'swap',
})

const SITE_URL = siteUrl()

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: '%s',
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: 'Dovydas Luksa', url: SITE_URL }],
  creator: 'Dovydas Luksa',
  keywords: [
    'Dovydas Luksa',
    'ddev',
    'Next.js',
    'full-stack',
    'machine learning',
    'AI',
    'London',
  ],
  category: 'portfolio',
  verification: siteVerification(),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon', type: 'image/png', sizes: '512x512' },
      { url: '/favicon.ico', sizes: '48x48' },
    ],
    apple: '/apple-icon',
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    locale: 'en_GB',
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: SITE_TITLE,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ['/opengraph-image'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1c1c1c',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // The footer terminal needs a project list to search and navigate. `getProjects`
  // is cached, so this shares the fetch with whichever page is rendering.
  const projects = await getProjects()
  const commandProjects = projects.map(
    ({ slug, technologies, stars, updatedAt }) => ({
      slug,
      technologies,
      stars,
      updatedAt,
    })
  )

  return (
    <html
      lang="en"
      className={ubuntuMono.variable}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        {process.env.GOOGLE_SITE_VERIFICATION ? (
          <meta
            name="google-site-verification"
            content={process.env.GOOGLE_SITE_VERIFICATION}
          />
        ) : null}
      </head>
      <body className="scrollbar min-h-screen bg-surface-base font-display text-fg-base antialiased selection:bg-accent/30">
        <JsonLd id="ld-site" data={siteJsonLd()} />
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <Header />

            <main className="flex-1">{children}</main>

            <TerminalFooter projects={commandProjects} />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
