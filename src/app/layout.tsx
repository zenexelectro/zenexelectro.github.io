import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

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
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
