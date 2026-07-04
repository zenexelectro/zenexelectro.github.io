"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative w-full pt-32 pb-20 md:pt-48 md:pb-32 px-8 flex flex-col items-center text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="z-10 max-w-4xl space-y-6"
      >
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter text-balance leading-tight">
          Next-Gen Security & <br />
          <span className="text-muted-foreground">Smart Automation.</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground text-balance max-w-2xl mx-auto">
          Enterprise-grade installations and hyper-modern smart systems designed for the future of security.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8 px-4">
          <Button size="lg" className="rounded-full px-8 h-14 text-lg w-full sm:w-auto">
            Explore Solutions <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg w-full sm:w-auto bg-transparent border-primary/20 hover:bg-primary/5">
            Contact Sales
          </Button>
        </div>
      </motion.div>
      
      {/* Abstract Background Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
    </section>
  );
}
