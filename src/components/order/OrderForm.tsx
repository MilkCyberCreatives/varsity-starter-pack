"use client";

import { useMemo, useState } from "react";
import { PLANS, type ApplianceSlug } from "@/lib/plans";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const PRIMARY = "#c41a1a";

type Props = {
  selectedSlug: ApplianceSlug | null;
};

type ApiOk = {
  ok: true;
  reference: string;
  selected: {
    slug: ApplianceSlug;
    name: string;
    monthly: string;
    deposit: string;
  };
  emailed: boolean;
};

type ApiErr = { ok: false; error: string };

export default function OrderForm({ selectedSlug }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [appliance, setAppliance] = useState<ApplianceSlug | "">(
    selectedSlug ?? ""
  );

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [university, setUniversity] = useState("");
  const [residence, setResidence] = useState("");
  const [months, setMonths] = useState(5);
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiOk | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedPlan = useMemo(() => {
    if (!appliance) return null;
    return PLANS.find((p) => p.slug === appliance) ?? null;
  }, [appliance]);

  function setApplianceAndSyncUrl(slug: ApplianceSlug) {
    setAppliance(slug);

    // ✅ keep the page header in sync by updating ?appliance=
    const params = new URLSearchParams(searchParams?.toString());
    params.set("appliance", slug);
    router.replace(`/order?${params.toString()}`, { scroll: false });
  }

  async function submit() {
    if (loading) return;

    setError(null);

    if (!appliance) return setError("please select an appliance.");
    if (!fullName.trim()) return setError("please enter your full name.");
    if (!email.trim()) return setError("please enter your email address.");
    if (!phone.trim()) return setError("please enter your phone number.");
    if (!Number.isFinite(months) || months < 5)
      return setError("minimum rental period is 5 months.");

    setLoading(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          appliance,
          fullName,
          email,
          phone,
          university,
          residence,
          months,
          notes,
        }),
      });

      let data: ApiOk | ApiErr;
      try {
        data = (await res.json()) as ApiOk | ApiErr;
      } catch {
        setError("something went wrong. please try again.");
        return;
      }

      if (!res.ok || !data.ok) {
        setError(!data.ok ? data.error : "something went wrong.");
        return;
      }

      setResult(data);
    } catch {
      setError("network error. please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-black/10 bg-white p-6">
      <p className="text-sm text-black/70">
        fill in your details. we’ll send you a unique reference number and next
        steps via email.
      </p>

      {/* selector */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {PLANS.map((p) => {
          const active = appliance === p.slug;
          return (
            <button
              key={p.slug}
              type="button"
              onClick={() => setApplianceAndSyncUrl(p.slug)}
              className="rounded-2xl border px-4 py-3 text-left text-xs font-semibold tracking-widest transition"
              style={{
                borderColor: active ? "rgba(0,0,0,0.18)" : "rgba(0,0,0,0.10)",
                backgroundColor: active ? "rgba(0,0,0,0.03)" : "white",
              }}
            >
              <div className="text-black">{p.name}</div>
              <div className="mt-2 text-[11px] text-black/55">{p.monthly}</div>
              <div className="mt-1 text-[11px] text-black/45">{p.deposit}</div>
            </button>
          );
        })}
      </div>

      {/* fields */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="full name">
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
          />
        </Field>

        <Field label="email">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
          />
        </Field>

        <Field label="phone">
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
          />
        </Field>

        <Field label="rental months (min 5)">
          <input
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            type="number"
            min={5}
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
          />
        </Field>

        <Field label="university (optional)">
          <input
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
          />
        </Field>

        <Field label="residence / apartment (optional)">
          <input
            value={residence}
            onChange={(e) => setResidence(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
          />
        </Field>
      </div>

      <div className="mt-4">
        <Field label="notes (optional)">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
          />
        </Field>
      </div>

      {error && (
        <p className="mt-4 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-black/70">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-6 rounded-2xl border border-black/10 bg-white px-4 py-4">
          <p className="text-xs font-semibold tracking-widest text-black/50">
            SUCCESS
          </p>
          <p className="mt-2 text-sm text-black/70">
            reference number:{" "}
            <span className="font-semibold text-black">{result.reference}</span>
          </p>
          <p className="mt-1 text-xs text-black/50">
            email sent: {result.emailed ? "yes" : "not configured yet"}
          </p>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <a
              href={`https://wa.me/27734921669?text=${encodeURIComponent(
                `Hi, I submitted an order request. Reference: ${result.reference}. Please assist with next steps.`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-5 py-3 text-xs font-semibold tracking-widest text-black transition hover:bg-black/5"
            >
              WHATSAPP WITH REF
            </a>

            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-xs font-semibold tracking-widest text-white transition hover:bg-black/90"
            >
              VIEW PRICING
            </Link>
          </div>
        </div>
      )}

      <div className="mt-6">
        <button
          type="button"
          disabled={loading}
          onClick={submit}
          className="inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-xs font-semibold tracking-widest text-white transition hover:opacity-90 disabled:opacity-60"
          style={{ backgroundColor: PRIMARY }}
        >
          {loading ? "SUBMITTING..." : "SUBMIT ORDER REQUEST"}
        </button>
      </div>

      {selectedPlan && (
        <p className="mt-3 text-[11px] text-black/45">
          selected: {selectedPlan.name} • {selectedPlan.monthly} •{" "}
          {selectedPlan.deposit}
        </p>
      )}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-semibold tracking-widest text-black/50">
        {label.toUpperCase()}
      </p>
      <div className="mt-2">{children}</div>
    </div>
  );
}
