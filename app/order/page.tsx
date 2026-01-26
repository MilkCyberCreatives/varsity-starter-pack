import type { Metadata } from "next";
import MainHeader from "@/components/layout/MainHeader";
import FooterSection from "@/components/layout/FooterSection";
import OrderForm from "@/components/order/OrderForm";
import { getPlanBySlug } from "@/lib/plans";

export const metadata: Metadata = {
  title: "order",
  description:
    "request an order for student-only appliance rentals. get a reference number and next steps via email.",
};

type Props = {
  searchParams?: { appliance?: string };
};

export default function OrderPage({ searchParams }: Props) {
  const selectedPlan = getPlanBySlug(searchParams?.appliance);

  return (
    <main className="min-h-screen bg-white">
      <MainHeader />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-xs font-semibold tracking-widest text-black/50">
          ORDER REQUEST
        </p>

        <h1 className="mt-3 text-4xl font-medium tracking-tight text-black">
          request an order
        </h1>

        <p className="mt-4 max-w-2xl text-base text-black/65">
          selected appliance:{" "}
          <span className="font-semibold text-black">
            {selectedPlan ? selectedPlan.name : "not selected"}
          </span>
        </p>

        <div className="mt-10">
          <OrderForm selectedSlug={selectedPlan?.slug ?? null} />
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
