import type { Metadata } from "next";
import { Ubuntu, Ubuntu_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import type { ThemeProviderProps } from "next-themes";
import Header from "@/components/Header";


// Themes properties
const THEME_PROPS = {
  attribute: 'class',
  defaultTheme: 'void',
  themes: ['palenight', 'void', 'cyberpunk', 'ashlight', 'cream'],
 
} satisfies ThemeProviderProps;

// Site fonts
const ubuntu = Ubuntu({
  variable: "--font-ubuntu",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const ubuntuMono = Ubuntu_Mono({
  variable: "--font-ubuntu-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Metadata
export const metadata: Metadata = {
  title: "DDEV",
  description: "Personal Website",
};



export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={ubuntuMono.variable}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-surface-base">
        <ThemeProvider {...THEME_PROPS}>
          <Header />
          {children}

        </ThemeProvider>
      </body>
    </html>
  );
}
