"use client";

import { motion } from "framer-motion";
import { Shield, Cpu, Video } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ServicesSection() {
  const services = [
    {
      title: "CCTV & IP Security",
      description: "High-definition surveillance systems with AI-powered analytics and remote monitoring.",
      icon: <Video className="w-8 h-8 mb-4 text-primary" />,
    },
    {
      title: "Smart Automation",
      description: "Next-generation IoT automation for homes and enterprise facilities. Control everything from anywhere.",
      icon: <Cpu className="w-8 h-8 mb-4 text-primary" />,
    },
    {
      title: "Access Control",
      description: "Biometric and RFID security barriers ensuring strict access compliance for secure zones.",
      icon: <Shield className="w-8 h-8 mb-4 text-primary" />,
    },
  ];

  return (
    <section id="services" className="w-full max-w-screen-2xl px-8 py-24">
      <div className="flex flex-col items-start mb-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">Our Expertise</h2>
        <p className="text-muted-foreground mt-4 text-lg">Precision-engineered systems for uncompromising safety.</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
          >
            <Card className="h-full bg-card/50 backdrop-blur border-border/50 glow-card hover:bg-card/80 transition-colors">
              <CardHeader>
                {service.icon}
                <CardTitle className="text-2xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-muted-foreground">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
