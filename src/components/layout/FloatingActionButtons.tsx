"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone } from "lucide-react";
import { useState } from "react";

// Custom WhatsApp Vector Icon
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const CONTACT_ACTIONS = [
  {
    id: "whatsapp",
    label: "Chat on WhatsApp",
    href: "https://wa.me/917356863575",
    icon: WhatsAppIcon,
    bgClass: "bg-gradient-to-tr from-[#128C7E] to-[#25D366]",
    glowColor: "rgba(37,211,102,0.6)",
  },
  {
    id: "gmail",
    label: "Send Email",
    href: "mailto:zenexelectro@gmail.com",
    icon: Mail,
    bgClass: "bg-gradient-to-tr from-[#D44638] to-[#EA4335]",
    glowColor: "rgba(234,67,53,0.6)",
  },
  {
    id: "phone",
    label: "Call Now",
    href: "tel:+917356863575",
    icon: Phone,
    bgClass: "bg-gradient-to-tr from-[#0052D4] via-[#4364F7] to-[#6FB1FC]",
    glowColor: "rgba(67,100,247,0.6)",
  }
];

export function FloatingActionButtons() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 flex flex-col gap-4 items-end">
      {CONTACT_ACTIONS.map((action, index) => (
        <motion.div
          key={action.id}
          initial={{ opacity: 0, y: 30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            delay: 1 + index * 0.15, 
            duration: 0.6,
            type: "spring",
            stiffness: 200,
            damping: 20 
          }}
          className="relative flex items-center justify-end"
          onMouseEnter={() => setHoveredId(action.id)}
          onMouseLeave={() => setHoveredId(null)}
          onClick={() => setHoveredId(action.id)}
        >
          {/* Tooltip with Glassmorphism & Framer Motion */}
          <AnimatePresence>
            {hoveredId === action.id && (
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-full mr-4 px-4 py-2 rounded-xl bg-slate-900/90 dark:bg-white/10 backdrop-blur-md border border-slate-700/50 dark:border-white/20 text-white font-medium text-sm whitespace-nowrap shadow-xl pointer-events-none"
              >
                {action.label}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Continuous Floating Animation Wrapper */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ 
              repeat: Infinity, 
              duration: 3 + index * 0.4, // Staggered floating phases
              ease: "easeInOut" 
            }}
          >
            {/* Action Button */}
            <motion.a
              href={action.href}
              target={action.id === "whatsapp" ? "_blank" : undefined}
              rel={action.id === "whatsapp" ? "noopener noreferrer" : undefined}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full ${action.bgClass} text-white shadow-lg transition-all duration-300 overflow-hidden hover:shadow-2xl`}
              style={{
                boxShadow: `0 10px 25px -5px ${action.glowColor}, 0 8px 10px -6px ${action.glowColor}`
              }}
              aria-label={action.label}
            >
              {/* Pulse Glow Effect inside button on hover */}
              <div 
                className={`absolute inset-0 transition-opacity duration-300 ${hoveredId === action.id ? "opacity-100 animate-pulse" : "opacity-0"}`}
                style={{
                  background: `radial-gradient(circle at center, white 0%, transparent 80%)`,
                  mixBlendMode: "overlay"
                }}
              />
              
              {/* Icon */}
              <action.icon className="w-6 h-6 md:w-7 md:h-7 relative z-10 drop-shadow-md" />
              
              {/* Glass reflection (Top Half) */}
              <div className="absolute top-0 left-0 right-0 bottom-1/2 bg-gradient-to-b from-white/30 to-transparent rounded-t-full pointer-events-none" />
            </motion.a>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
