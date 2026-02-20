import dynamic from "next/dynamic";
import MainHeader from "@/components/layout/MainHeader";
import HeroSection from "@/components/home/HeroSection";
import PricingSection from "@/components/home/PricingSection";
import FooterSection from "@/components/layout/FooterSection";

const ProductGallerySection = dynamic(
  () => import("@/components/home/ProductGallerySection"),
  {
    loading: () => <section className="mx-auto max-w-6xl px-4 py-16" aria-hidden="true" />,
  }
);

const HowItWorksSection = dynamic(
  () => import("@/components/home/HowItWorksSection"),
  {
    loading: () => <section className="mx-auto max-w-6xl px-4 py-16" aria-hidden="true" />,
  }
);

const FAQSection = dynamic(() => import("@/components/home/FAQSection"), {
  loading: () => <section className="mx-auto max-w-6xl px-4 py-16" aria-hidden="true" />,
});

const TestimonialsSection = dynamic(
  () => import("@/components/home/TestimonialsSection"),
  {
    loading: () => <section className="mx-auto max-w-6xl px-4 py-16" aria-hidden="true" />,
  }
);

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen flex-col vsp-page-bg">
      <div className="relative z-10 flex min-h-screen flex-col">
        <MainHeader />
        <HeroSection />
        <PricingSection />
        <ProductGallerySection />
        <HowItWorksSection />
        <FAQSection />
        <TestimonialsSection />
        <FooterSection />
      </div>
    </main>
  );
}


