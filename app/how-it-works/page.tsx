import MainHeader from "@/components/layout/MainHeader";

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-white">
      <MainHeader />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-xs font-semibold tracking-widest text-black/50">
          HOW IT WORKS
        </p>

        <h1 className="mt-3 text-4xl font-medium tracking-tight text-black">
          the full rental process
        </h1>

        <p className="mt-4 max-w-2xl text-base text-black/65">
          this page explains the full Varsity Starter Pack rental process step-by-step.
          (we’ll expand this page next with the full detailed flow and visuals.)
        </p>

        <div className="mt-10 rounded-3xl border border-black/10 bg-white p-6">
          <ol className="space-y-4 text-sm text-black/70">
            <li>1) choose your appliance(s) and rental duration (minimum 5 months).</li>
            <li>2) submit your details (campus, res/address, contact info).</li>
            <li>3) receive a unique reference number and payment instructions by email.</li>
            <li>4) send POP + required documents (student card + ID copy).</li>
            <li>5) we confirm and schedule delivery to your res/apartment (t&cs apply).</li>
          </ol>
        </div>
      </section>
    </main>
  );
}
