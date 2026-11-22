import type { Metadata } from "next";
import { Ubuntu_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import type { ThemeProviderProps } from "next-themes";
import Header from "@/components/Header";
import AppSidebar from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Suspense } from "react";

// Themes properties
const THEME_PROPS = {
  attribute: "class",
  defaultTheme: "void",
  themes: ["palenight", "void", "cyberpunk", "ashlight", "cream"],
} satisfies ThemeProviderProps;

// Site fonts
const ubuntuMono = Ubuntu_Mono({
  variable: "--font-ubuntu-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

// Metadata
export const metadata: Metadata = {
  title: {
    default: "ddev -zsh",  
    template: "~/%s — dluksa.dev",       
  },
  description: "Personal Website",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={ubuntuMono.variable} suppressHydrationWarning>
      <body className="scrollbar min-h-screen font-ubuntu-mono bg-surface-base text-fg-base antialiased selection:bg-accent/30">
        <ThemeProvider {...THEME_PROPS}>
          {/* Closed by default; the header menu button opens it */}
          <SidebarProvider defaultOpen={false}>
            {/* Page column: shrinks to make room when the sidebar opens on desktop */}
            <div className="flex min-w-0 flex-1 flex-col">
              <Suspense>
                <Header />
              </Suspense>
              {children}
            </div>
            <AppSidebar />
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
