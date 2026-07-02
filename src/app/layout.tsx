import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://zenexelectro.pages.dev'),
  title: "Zenex Electronics & Security Systems",
  description: "Premium enterprise-level security, electronics, and smart automation installations.",
  openGraph: {
    title: "Zenex Electronics & Security Systems",
    description: "Premium enterprise-level security, electronics, and smart automation installations.",
    url: 'https://zenexelectro.pages.dev',
    siteName: 'Zenex Systems',
    images: ['/ZenexLogo.jpg'],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zenex Electronics & Security Systems',
    description: 'Premium enterprise-level security, electronics, and smart automation installations.',
    images: ['/ZenexLogo.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", "font-sans")}>
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col bg-background text-foreground">
          {/* Header */}
          <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 max-w-screen-2xl items-center px-4 md:px-8">
              <div className="mr-4 flex w-full justify-between items-center md:justify-start">
                <a className="mr-2 sm:mr-6 flex items-center space-x-2" href="/">
                  <span className="font-bold inline-block text-base sm:text-xl tracking-tight">
                    ZENEX<span className="text-muted-foreground font-light text-[10px] sm:text-base">SYSTEMS</span>
                  </span>
                </a>
                <nav className="flex items-center gap-2 sm:gap-4 md:gap-6 text-[10px] sm:text-xs md:text-sm">
                  <a className="transition-colors hover:text-foreground/80 text-foreground/60" href="#services">Services</a>
                  <a className="transition-colors hover:text-foreground/80 text-foreground/60" href="#showcase">Showcase</a>
                  <a className="transition-colors hover:text-foreground/80 text-foreground/60" href="#contact">Contact</a>
                </nav>
              </div>
            </div>
          </header>
          
          <main className="flex-1">{children}</main>
          
          {/* Footer */}
          <footer className="border-t border-border/40 py-6 md:px-8 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-8">
              <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
                © {new Date().getFullYear()} Zenex Electronics & Electricals. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
