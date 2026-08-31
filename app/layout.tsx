import type { Metadata, Viewport } from "next"
import { Ubuntu_Mono } from "next/font/google"
import Header from "@/components/Header"
import ThemeProvider from "@/components/ThemeProvider"
import TerminalFooter from "@/components/TerminalFooter"
import { getProjects } from "@/lib/github"
import "./globals.css"

const ubuntuMono = Ubuntu_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-ubuntu-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "ddev — Dovydas Luksa",
  description:
    "MSc graduate in Robotics, AI & Autonomous Systems. Machine learning in Python, web applications in TypeScript and Next.js. Based in London.",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
      <body className="scrollbar min-h-screen bg-surface-base text-fg-base selection:bg-accent/30">
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
