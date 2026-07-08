"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="w-full max-w-screen-2xl px-8 py-24 mb-20">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-primary/10 border border-primary/20 p-8 md:p-16 flex flex-col items-center text-center"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight max-w-2xl mb-6 relative z-10">
          Ready to secure your premises with Next-Gen technology?
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 relative z-10">
          Contact our expert team today for a free consultation and personalized security audit.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 relative z-10">
          <a href="https://wa.me/917356863575?text=Hi%2C%20I%20would%20like%20to%20get%20a%20free%20quote" target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-primary text-primary-foreground hover:bg-primary/80 h-14 px-8 text-lg w-full sm:w-auto font-medium transition-all focus-visible:ring-3 focus-visible:ring-ring/50 outline-none select-none">
            Get a Free Quote
          </a>
          <a href="tel:+917356863575" className="inline-flex shrink-0 items-center justify-center rounded-full border border-border bg-background/50 backdrop-blur text-foreground hover:bg-muted h-14 px-8 text-lg w-full sm:w-auto font-medium transition-all focus-visible:ring-3 focus-visible:ring-ring/50 outline-none select-none">
            Talk to an Expert
          </a>
        </div>
      </motion.div>
    </section>
  );
}
