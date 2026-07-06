"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Mail, Phone, MapPin, Clock } from "lucide-react";

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export function HeaderContactWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const contactLinks = [
    {
      id: "whatsapp",
      label: "Live Chat",
      value: "Response time: ~5 mins",
      href: "https://wa.me/917356863575",
      icon: WhatsAppIcon,
      colorClass: "text-[#25D366] bg-[#25D366]/10",
      hoverClass: "group-hover:bg-[#25D366]/20",
    },
    {
      id: "phone",
      label: "Phone Support",
      value: "+91 73568 63575",
      href: "tel:+917356863575",
      icon: Phone,
      colorClass: "text-[#007AFF] bg-[#007AFF]/10",
      hoverClass: "group-hover:bg-[#007AFF]/20",
    },
    {
      id: "email",
      label: "Email Us",
      value: "zenexelectro@gmail.com",
      href: "mailto:zenexelectro@gmail.com",
      icon: Mail,
      colorClass: "text-[#FF9500] bg-[#FF9500]/10",
      hoverClass: "group-hover:bg-[#FF9500]/20",
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 active:scale-95"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        Connect
        <MessageCircle className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 250, damping: 25 }}
            className="absolute right-0 top-full mt-3 w-[340px] md:w-[380px] overflow-hidden rounded-[24px] border border-border/60 bg-background/80 backdrop-blur-3xl shadow-2xl origin-top-right z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/40 p-5 bg-gradient-to-br from-foreground/5 to-transparent">
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-foreground tracking-tight">Let's Connect</h3>
                <p className="text-xs text-muted-foreground mt-0.5">We typically reply within a few minutes.</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/5 text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col gap-5">
              {/* Quick Actions Grid */}
              <div className="grid grid-cols-1 gap-3">
                {contactLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    target={link.id === "whatsapp" ? "_blank" : undefined}
                    rel={link.id === "whatsapp" ? "noopener noreferrer" : undefined}
                    className="group flex items-center gap-4 rounded-2xl border border-border/40 bg-card/50 p-3 transition-all duration-300 hover:bg-muted/50 hover:border-border/80 hover:shadow-sm active:scale-[0.98]"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${link.colorClass} ${link.hoverClass}`}>
                      <link.icon className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-foreground">{link.label}</span>
                      <span className="text-xs text-muted-foreground">{link.value}</span>
                    </div>
                  </a>
                ))}
              </div>

              {/* Info Section */}
              <div className="flex flex-col gap-4 rounded-2xl border border-border/40 bg-card/30 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground/5">
                    <MapPin className="h-3.5 w-3.5 text-foreground/70" />
                  </div>
                  <div className="flex flex-col mt-0.5">
                    <span className="text-xs font-semibold text-foreground">Office Location</span>
                    <span className="text-xs text-muted-foreground mt-0.5 leading-relaxed">Kerala, India</span>
                  </div>
                </div>
                <div className="h-px w-full bg-border/40" />
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground/5">
                    <Clock className="h-3.5 w-3.5 text-foreground/70" />
                  </div>
                  <div className="flex flex-col mt-0.5">
                    <span className="text-xs font-semibold text-foreground">Business Hours</span>
                    <span className="text-xs text-muted-foreground mt-0.5">Mon-Sat: 9:00 AM - 6:00 PM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border/40 bg-muted/20 px-5 py-3">
              <span className="text-[11px] font-medium text-muted-foreground">Follow our social channels</span>
              <div className="flex items-center gap-2">
                <a href="https://instagram.com/zenexelectro" target="_blank" rel="noopener noreferrer" className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground/5 text-muted-foreground transition-all duration-300 hover:bg-[#ee2a7b] hover:text-white">
                  <InstagramIcon className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
