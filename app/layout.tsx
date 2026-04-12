import Header from "@/components/Header"
import "./globals.css"
import ThemeProvider from "@/components/ThemeProvider"
import TerminalFooter from "@/components/TerminalFooter"


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning >
      <body className="bg-surface-base text-fg-base min-h-screen scrollbar selection:bg-accent/30">
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <Header />

            {/* Page content */}
            <main className="flex flex-1 items-center justify-center">
              {children}
            </main>
            <TerminalFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

