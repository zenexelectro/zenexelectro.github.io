"use client";

import { motion } from "framer-motion";
import { Phone, MessageCircle, Camera, Shield, Cpu, Video, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
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
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden">
      {/* Hero Section */}
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

      {/* Services Grid Section */}
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

      {/* Floating Unified Communication Bar */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 flex flex-col gap-3"
      >
        <Button size="icon" className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg shadow-green-900/20">
          <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </Button>
        <Button size="icon" className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-pink-600 hover:bg-pink-700 shadow-lg shadow-pink-900/20">
          <Camera className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </Button>
        <Button size="icon" className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/20">
          <Phone className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </Button>
      </motion.div>
    </div>
  );
}
