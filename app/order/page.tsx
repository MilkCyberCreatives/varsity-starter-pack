import MainHeader from "@/components/layout/MainHeader";

type Props = {
  searchParams?: { appliance?: string };
};

function prettyAppliance(value?: string) {
  if (!value) return "not selected";
  if (value === "bar-fridge") return "BAR FRIDGE";
  if (value === "microwave") return "MICROWAVE";
  if (value === "top-freezer") return "TOP FREEZER";
  return value.toUpperCase();
}

export default function OrderPage({ searchParams }: Props) {
  const selected = prettyAppliance(searchParams?.appliance);

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
          selected appliance: <span className="font-semibold text-black">{selected}</span>
        </p>

        <div className="mt-10 rounded-3xl border border-black/10 bg-white p-6">
          <p className="text-sm text-black/70">
            next: we’ll build the full multi-step order form here (with unique reference number + email automation).
          </p>
        </div>
      </section>
    </main>
  );
}
