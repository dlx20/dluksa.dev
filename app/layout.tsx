import type { Metadata, Viewport } from 'next'
import { Ubuntu_Mono } from 'next/font/google'
import Header from '@/components/Header'
import ThemeProvider from '@/components/ThemeProvider'
import TerminalFooter from '@/components/TerminalFooter'
import { getProjects } from '@/lib/github'
import './globals.css'

const ubuntuMono = Ubuntu_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-ubuntu-mono',
  display: 'swap',
})

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://dluksa.dev'

const DESCRIPTION =
  'MSc graduate in Robotics, AI & Autonomous Systems. Machine learning in Python, web applications in TypeScript and Next.js. Based in London.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'ddev — Dovydas Luksa',
    template: '%s',
  },
  description: DESCRIPTION,
  applicationName: 'ddev',
  authors: [{ name: 'Dovydas Luksa', url: SITE_URL }],
  openGraph: {
    title: 'ddev — Dovydas Luksa',
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: 'ddev',
    locale: 'en_GB',
    type: 'website',
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
      <body className="scrollbar min-h-screen bg-surface-base font-display text-fg-base antialiased selection:bg-accent/30">
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
