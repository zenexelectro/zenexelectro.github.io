import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Home, Zap, Camera } from "lucide-react";

// Service Data Array (English & Malayalam) / സർവീസ് വിവരങ്ങൾ അടങ്ങിയ അറേ
const services = [
  {
    title: "CCTV & IP Cameras (സി.സി.ടി.വി)",
    description: "High-end IP camera installations with cloud storage, remote viewing, and AI tracking.",
    icon: Camera,
  },
  {
    title: "Smart Automation (സ്മാർട്ട് ഹോം)",
    description: "Complete home and office automation using premium IoT devices and voice control.",
    icon: Home,
  },
  {
    title: "Electrical Systems (ഇലക്ട്രിക്കൽ)",
    description: "Enterprise-grade electrical wiring, panels, and certified safety systems.",
    icon: Zap,
  },
  {
    title: "Access Control (ആക്സസ് കൺട്രോൾ)",
    description: "Biometric and RFID security for offices, factories, and high-security areas.",
    icon: Shield,
  }
];

// Service Grid Component / സർവീസുകൾ കാണിക്കുന്ന ഗ്രിഡ് ഘടകം
export function ServiceGrid() {
  return (
    // Grid layout for services / സർവീസുകൾ ഗ്രിഡ് രൂപത്തിൽ ക്രമീകരിക്കുന്നു
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {services.map((service, index) => (
        // Individual Service Card with hover animations / ഓരോ സർവീസിനുമുള്ള കാർഡ് (അനിമേഷൻ സഹിതം)
        <Card key={index} className="group hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
          <CardHeader>
            {/* Service Icon / ഐക്കൺ */}
            <service.icon className="w-10 h-10 text-blue-600 dark:text-blue-500 mb-4 group-hover:scale-110 transition-transform duration-300" />
            {/* Service Title / സർവീസിന്റെ പേര് */}
            <CardTitle className="text-xl tracking-tight">{service.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Service Description / വിവരണം */}
            <CardDescription className="text-base text-zinc-600 dark:text-zinc-400">
              {service.description}
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
