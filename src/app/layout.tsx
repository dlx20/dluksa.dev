import type { Metadata } from "next";
import { Ubuntu, Ubuntu_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";




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
    >
      <body className="min-h-full flex flex-col">
        {children}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          

        </ThemeProvider>
      </body>
    </html>
  );
}
