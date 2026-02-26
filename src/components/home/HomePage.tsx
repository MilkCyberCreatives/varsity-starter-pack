import MainHeader from "@/components/layout/MainHeader";
import HeroSection from "@/components/home/HeroSection";
import PricingSection from "@/components/home/PricingSection";
import FooterSection from "@/components/layout/FooterSection";
import ProductGallerySection from "@/components/home/ProductGallerySection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import FAQSection from "@/components/home/FAQSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";

export default function HomePage() {
  return (
    <main className="relative z-10 flex flex-col vsp-page-bg">
      <MainHeader />
      <HeroSection />
      <PricingSection />
      <ProductGallerySection />
      <HowItWorksSection />
      <FAQSection />
      <TestimonialsSection />
      <FooterSection />
    </main>
  );
}


