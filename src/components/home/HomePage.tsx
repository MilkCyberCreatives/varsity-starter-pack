import MainHeader from "@/components/layout/MainHeader";
import HeroSection from "@/components/home/HeroSection";
import PricingSection from "@/components/home/PricingSection";
import ProductGallerySection from "@/components/home/ProductGallerySection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import FAQSection from "@/components/home/FAQSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FooterSection from "@/components/layout/FooterSection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <MainHeader />
      <HeroSection />

      {/* ✅ pricing section now follows */}
      <PricingSection />

      <ProductGallerySection />
      <HowItWorksSection />
      <FAQSection />
      <TestimonialsSection />
      <FooterSection />
    </main>
  );
}
