import type { Metadata, Viewport } from 'next'
import { Ubuntu_Mono } from 'next/font/google'
import Header from '@/components/Header'
import ThemeProvider from '@/components/ThemeProvider'
import TerminalFooter from '@/components/TerminalFooter'
import { getProjects } from '@/lib/github'
import { EMAIL, SOCIALS } from '@/lib/constants'
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, siteUrl } from '@/lib/seo'
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
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/email-logo.png', type: 'image/png' },
    ],
    apple: '/email-logo.png',
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      alternateName: 'Dovydas Luksa',
      description: SITE_DESCRIPTION,
      inLanguage: 'en-GB',
      publisher: { '@id': `${SITE_URL}/#person` },
    },
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: 'Dovydas Luksa',
      alternateName: SITE_NAME,
      url: SITE_URL,
      image: `${SITE_URL}/icon`,
      description: SITE_DESCRIPTION,
      jobTitle: 'Next.js full-stack and AI/ML developer',
      email: EMAIL,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'London',
        addressCountry: 'GB',
      },
      sameAs: SOCIALS.filter((social) => social.url.startsWith('http')).map(
        (social) => social.url
      ),
    },
  ],
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
      <body className="scrollbar min-h-screen bg-surface-base font-display text-fg-base antialiased selection:bg-accent/30">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
