import React from "react";
import { Button } from "@/components/ui/button";
import { ServiceGrid } from "@/components/modules/service-grid";

// Main Landing Page Component / പ്രധാന ലാൻഡിംഗ് പേജ് ഘടകം
export default function HomePage() {
  return (
    // Main wrapper with dark/light themes and gradient background
    // ഡാർക്ക്/ലൈറ്റ് തീമുകളും ഗ്രേഡിയന്റ് ബാക്ക്ഗ്രൗണ്ടും ഉള്ള പ്രധാന വ്രാപ്പർ
    <main className="flex min-h-screen flex-col items-center justify-start bg-zinc-50 dark:bg-zinc-950">
      
      {/* Navigation Bar Placeholder / നാവിഗേഷൻ ബാർ */}
      <nav className="w-full border-b border-zinc-200 dark:border-zinc-800 p-4 md:p-6 flex justify-between items-center bg-white/50 dark:bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="text-2xl md:text-3xl font-black tracking-tighter">
          Zenex<span className="text-blue-600 dark:text-blue-500">Electro</span>
        </div>
        <div className="space-x-2 md:space-x-4">
          {/* Login Button for Admin / അഡ്മിൻ ലോഗിൻ ബട്ടൺ */}
          <Button variant="ghost" className="hidden md:inline-flex">Admin Login (അഡ്മിൻ)</Button>
          <Button>Contact Us (ബന്ധപ്പെടുക)</Button>
        </div>
      </nav>

      {/* Hero Section / പ്രധാന ഹീറോ സെക്ഷൻ */}
      <section className="w-full max-w-6xl text-center flex flex-col items-center justify-center min-h-[70vh] px-4 space-y-8 mt-10">
        {/* Main Heading / പ്രധാന തലക്കെട്ട് */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
          Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Security & Electrical</span> Solutions
        </h1>
        
        {/* Sub-heading in English & Malayalam / ഇംഗ്ലീഷിലും മലയാളത്തിലുമുള്ള വിവരണം */}
        <p className="text-lg md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-3xl">
          Advanced CCTV, Smart Home Automation, and Enterprise Electrical Systems.
          <br/>
          <span className="text-base md:text-lg opacity-80 mt-4 block leading-relaxed">
            ഏറ്റവും മികച്ച സി.സി.ടി.വി, സ്മാർട്ട് ഹോം ഓട്ടോമേഷൻ, ഇലക്ട്രിക്കൽ സിസ്റ്റംസ് എന്നിവ നിങ്ങളുടെ ആവശ്യാനുസരണം.
          </span>
        </p>

        {/* Action Buttons / ആക്ഷൻ ബട്ടണുകൾ */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto">
          <Button size="lg" className="text-lg w-full sm:w-auto h-12">
            View Services (സേവനങ്ങൾ)
          </Button>
          <Button size="lg" variant="outline" className="text-lg w-full sm:w-auto h-12">
            AI Chatbot (സഹായം)
          </Button>
        </div>
      </section>

      {/* Services Grid Section / സേവനങ്ങൾ കാണിക്കുന്ന ഗ്രിഡ് */}
      <section className="w-full max-w-6xl py-20 px-4 flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Our Services (ഞങ്ങളുടെ സേവനങ്ങൾ)</h2>
        <ServiceGrid />
      </section>
    </main>
  );
}
