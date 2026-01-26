import MainHeader from "@/components/layout/MainHeader";
import Link from "next/link";

type ApplianceSlug = "bar-fridge" | "microwave" | "top-freezer";

type Props = {
  searchParams?: { appliance?: string };
};

const APPLIANCES: Record<
  ApplianceSlug,
  { label: string; monthly: string; deposit: string }
> = {
  "bar-fridge": { label: "BAR FRIDGE", monthly: "R250 / MONTH", deposit: "R400 refundable deposit" },
  microwave: { label: "MICROWAVE", monthly: "R160 / MONTH", deposit: "R300 refundable deposit" },
  "top-freezer": { label: "TOP FREEZER", monthly: "R360 / MONTH", deposit: "R600 refundable deposit" },
};

function toApplianceSlug(value?: string): ApplianceSlug | null {
  if (!value) return null;
  const v = value.trim().toLowerCase();
  if (v === "bar-fridge" || v === "microwave" || v === "top-freezer") return v;
  return null;
}

export default function OrderPage({ searchParams }: Props) {
  const slug = toApplianceSlug(searchParams?.appliance);
  const selected = slug ? APPLIANCES[slug] : null;

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

        {/* Selected appliance summary */}
        <p className="mt-4 max-w-2xl text-base text-black/65">
          selected appliance:{" "}
          <span className="font-semibold text-black">
            {selected ? selected.label : "not selected"}
          </span>
        </p>

        {/* If invalid or missing, guide user */}
        {!selected && (
          <div className="mt-6 rounded-3xl border border-black/10 bg-white p-6">
            <p className="text-sm text-black/70">
              please choose an appliance to continue:
            </p>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              {(
                Object.keys(APPLIANCES) as Array<keyof typeof APPLIANCES>
              ).map((k) => (
                <Link
                  key={k}
                  href={`/order?appliance=${k}`}
                  className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-5 py-3 text-xs font-semibold tracking-widest text-black transition hover:bg-black/5"
                >
                  {APPLIANCES[k].label}
                </Link>
              ))}
            </div>

            {searchParams?.appliance && !slug && (
              <p className="mt-4 text-xs text-black/50">
                we couldn’t recognise “{searchParams.appliance}”. please select
                one of the options above.
              </p>
            )}
          </div>
        )}

        {/* If selected, show the pricing snapshot (useful + confirms logic works) */}
        {selected && (
          <div className="mt-10 rounded-3xl border border-black/10 bg-white p-6">
            <p className="text-sm text-black/70">
              you selected <span className="font-semibold text-black">{selected.label}</span>.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-black/10 bg-white px-4 py-3">
                <p className="text-xs font-semibold tracking-widest text-black/50">
                  MONTHLY
                </p>
                <p className="mt-1 text-sm font-semibold text-black">{selected.monthly}</p>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white px-4 py-3">
                <p className="text-xs font-semibold tracking-widest text-black/50">
                  DEPOSIT
                </p>
                <p className="mt-1 text-sm font-semibold text-black">{selected.deposit}</p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-black/10 bg-white px-4 py-3">
              <p className="text-sm text-black/70">
                next: we’ll build the full multi-step order form here (with unique
                reference number + email automation).
              </p>
            </div>

            <div className="mt-5">
              <Link
                href="/how-it-works"
                className="text-xs font-semibold tracking-widest text-black/60 underline underline-offset-4 hover:text-black"
              >
                view how it works
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
