"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ParticleBackground } from "@/components/ui/ParticleBackground";

export function HeroSection() {
  return (
    <section className="relative w-full pt-32 pb-20 md:pt-48 md:pb-32 px-8 flex flex-col items-center text-center overflow-hidden">
      <ParticleBackground />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 max-w-4xl space-y-6"
      >
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter text-balance leading-tight">
          Next-Gen Security & <br />
          <span className="text-muted-foreground">Smart Automation.</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground text-balance max-w-2xl mx-auto">
          Enterprise-grade installations and hyper-modern smart systems designed for the future of security.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8 px-4">
          <a href="#services" className="inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-primary text-primary-foreground hover:bg-primary/80 h-14 px-8 text-lg w-full sm:w-auto font-medium transition-all focus-visible:ring-3 focus-visible:ring-ring/50 outline-none select-none">
            Explore Solutions <ArrowRight className="ml-2 w-5 h-5" />
          </a>
          <a href="https://wa.me/917356863575" target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center justify-center rounded-full border border-primary/20 bg-transparent text-foreground hover:bg-primary/5 h-14 px-8 text-lg w-full sm:w-auto font-medium transition-all focus-visible:ring-3 focus-visible:ring-ring/50 outline-none select-none">
            Contact Sales
          </a>
        </div>
      </motion.div>
      
      {/* Abstract Background Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
    </section>
  );
}
