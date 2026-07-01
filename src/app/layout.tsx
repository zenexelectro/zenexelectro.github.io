import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Chatbot } from "@/components/modules/chatbot";

// Initialize the Inter font / Inter ഫോണ്ട് സജ്ജീകരിക്കുന്നു
const inter = Inter({ subsets: ["latin"] });

// SEO Metadata for the website / വെബ്സൈറ്റിന്റെ SEO-യ്ക്ക് ആവശ്യമായ വിവരങ്ങൾ
// This replaces the old index.html head tags for SEO / പഴയ index.html-ന് പകരമുള്ള ഭാഗമാണിത്
export const metadata: Metadata = {
  title: "ZenexElectro | Premium Electronics & Security Systems",
  description: "High-end Electronics, Electrical, and Security Systems. Get custom CCTV, Smart Automation, and IP Cameras.",
  keywords: ["ZenexElectro", "CCTV", "Smart Automation", "Security Systems", "Electronics"],
};

// Root Layout component that wraps the entire app / ആപ്ലിക്കേഷന്റെ അടിസ്ഥാന ഘടന (Root Layout)
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Language set to English / ഭാഷ ഇംഗ്ലീഷ് ആയി സെറ്റ് ചെയ്യുന്നു
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* Theme Provider for Dark/Light mode / ഡാർക്ക്, ലൈറ്റ് മോഡുകൾക്കായുള്ള തീം പ്രൊവൈഡർ */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* This renders the page content / പ്രധാന പേജിലെ വിവരങ്ങൾ ഇവിടെയാണ് വരുന്നത് */}
          {children}
          {/* Global AI Chatbot / ഉപഭോക്താക്കൾക്കുള്ള AI ചാറ്റ്ബോട്ട് */}
          <Chatbot />
        </ThemeProvider>
      </body>
    </html>
  );
}
