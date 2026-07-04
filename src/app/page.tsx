import { HeroSection } from "@/components/home/HeroSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { CTASection } from "@/components/home/CTASection";
import { FloatingActionButtons } from "@/components/layout/FloatingActionButtons";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden">
      <HeroSection />
      <ServicesSection />
      <CTASection />
      <FloatingActionButtons />
    </div>
  );
}
