"use client";

import { motion } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export function FloatingActionButtons() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 flex flex-col gap-3"
    >
      <Button size="icon" className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg shadow-green-900/20">
        <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
      </Button>
      <a href="https://instagram.com/zenexelectro" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-pink-600 hover:bg-pink-700 shadow-lg shadow-pink-900/20 transition-colors">
        <InstagramIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
      </a>
      <Button size="icon" className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/20">
        <Phone className="w-5 h-5 md:w-6 md:h-6 text-white" />
      </Button>
    </motion.div>
  );
}
