"use client";

import { useMemo, useRef, useState } from "react";
import { PLANS, type ApplianceSlug } from "@/lib/plans";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

const PRIMARY = "#c41a1a";

type Props = {
  selectedSlugs: ApplianceSlug[];
};

type ApiOk = {
  ok: true;
  reference: string;
  emailed: boolean;
  selected: {
    slugs: ApplianceSlug[];
    items: { slug: ApplianceSlug; name: string; monthly: string; deposit: string }[];
    totals: { monthlyTotal: number; depositTotal: number; upfrontTotal: number };
  };
};

type ApiErr = { ok: false; error: string };

function moneyZAR(n: number) {
  return `R${n.toLocaleString("en-ZA")}`;
}

async function fileToBase64(file: File) {
  const buf = await file.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.byteLength; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

export default function OrderForm({ selectedSlugs }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [appliances, setAppliances] = useState<ApplianceSlug[]>(selectedSlugs ?? []);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [university, setUniversity] = useState("");
  const [residence, setResidence] = useState("");
  const [months, setMonths] = useState<number>(5);
  const [deliveryDate, setDeliveryDate] = useState<string>("");
  const [notes, setNotes] = useState("");

  // uploads (required)
  const [studentCard, setStudentCard] = useState<File | null>(null);
  const [idCopy, setIdCopy] = useState<File | null>(null);

  const studentCardRef = useRef<HTMLInputElement | null>(null);
  const idCopyRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiOk | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedPlans = useMemo(() => {
    const set = new Set(appliances);
    return PLANS.filter((p) => set.has(p.slug));
  }, [appliances]);

  const totals = useMemo(() => {
    const monthlyTotal = selectedPlans.reduce((sum, p) => sum + p.monthlyAmount, 0);
    const depositTotal = selectedPlans.reduce((sum, p) => sum + p.depositAmount, 0);
    const upfrontTotal = depositTotal; // ✅ deposit upfront (monthly paid after admin sends banking details)
    return { monthlyTotal, depositTotal, upfrontTotal };
  }, [selectedPlans]);

  function syncUrl(next: ApplianceSlug[]) {
    const params = new URLSearchParams(searchParams?.toString());
    if (next.length) params.set("appliance", next.join(","));
    else params.delete("appliance");
    router.replace(`/order?${params.toString()}`, { scroll: false });
  }

  function toggleAppliance(slug: ApplianceSlug) {
    setResult(null);
    setError(null);

    setAppliances((prev) => {
      const exists = prev.includes(slug);
      const next = exists ? prev.filter((x) => x !== slug) : [...prev, slug];
      syncUrl(next);
      return next;
    });
  }

  function validate() {
    if (appliances.length === 0) return "Please select at least one appliance.";
    if (!fullName.trim()) return "Please enter your full name.";
    if (!email.trim()) return "Please enter your email address.";
    if (!phone.trim()) return "Please enter your phone number.";
    if (!university.trim()) return "Please enter your university.";
    if (!residence.trim()) return "Please enter your residence / apartment.";
    if (!Number.isFinite(months) || months < 5) return "Minimum rental period is 5 months.";
    if (!deliveryDate) return "Please select a delivery date.";
    if (!studentCard) return "Please upload your student card.";
    if (!idCopy) return "Please upload your ID copy.";

    // light safety
    const maxBytes = 2.5 * 1024 * 1024;
    if (studentCard.size > maxBytes || idCopy.size > maxBytes) {
      return "Uploads must be under 2.5MB each (use a photo/compressed PDF).";
    }

    return null;
  }

  async function submit() {
    if (loading) return;
    setError(null);

    const err = validate();
    if (err) return setError(err);

    setLoading(true);
    try {
      const studentCardB64 = studentCard ? await fileToBase64(studentCard) : null;
      const idCopyB64 = idCopy ? await fileToBase64(idCopy) : null;

      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          appliances,
          fullName,
          email,
          phone,
          university,
          residence,
          months,
          deliveryDate,
          notes,
          uploads: {
            studentCard: studentCard
              ? { name: studentCard.name, type: studentCard.type || "application/octet-stream", base64: studentCardB64 }
              : null,
            idCopy: idCopy
              ? { name: idCopy.name, type: idCopy.type || "application/octet-stream", base64: idCopyB64 }
              : null,
          },
        }),
      });

      let data: ApiOk | ApiErr;
      try {
        data = (await res.json()) as ApiOk | ApiErr;
      } catch {
        setError("Something went wrong. Please try again.");
        return;
      }

      if (!res.ok || !("ok" in data) || !data.ok) {
        setError(!data.ok ? data.error : "Something went wrong.");
        return;
      }

      setResult(data);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      {/* LEFT: form */}
      <div className="rounded-3xl border border-black/10 bg-white p-6">
        <p className="text-sm text-black/70">
          Fill in your details. We’ll send you a unique reference number and next steps via email.
        </p>

        {/* appliance selector */}
        <div className="mt-6">
          <p className="text-xs font-semibold tracking-widest text-black/50">SELECT APPLIANCES</p>

          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {PLANS.map((p) => {
              const active = appliances.includes(p.slug);
              return (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => toggleAppliance(p.slug)}
                  className={[
                    "water-hover vsp-focus",
                    "rounded-2xl border bg-white px-4 py-4 text-left transition",
                    "hover:bg-black/[0.02]",
                  ].join(" ")}
                  style={{
                    borderColor: active ? "rgba(196,26,26,0.85)" : "rgba(0,0,0,0.10)",
                    outline: "none",
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-[13px] font-semibold text-black">{p.name}</div>
                    {active ? (
                      <span
                        className="rounded-full px-2 py-1 text-[10px] font-semibold tracking-widest"
                        style={{ backgroundColor: "rgba(196,26,26,0.10)", color: PRIMARY }}
                      >
                        SELECTED
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold tracking-widest text-black/40">ADD</span>
                    )}
                  </div>

                  <div className="mt-2 text-[11px] text-black/60">{p.monthly}</div>
                  <div className="mt-1 text-[11px] text-black/45">{p.deposit}</div>

                  {/* clean 3D highlight (no shadow) */}
                  <div
                    className="mt-4 h-[3px] w-12 rounded-full transition"
                    style={{
                      backgroundColor: active ? PRIMARY : "rgba(0,0,0,0.08)",
                      opacity: active ? 1 : 0.7,
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* fields */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Full name">
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
              required
            />
          </Field>

          <Field label="Email">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
              required
            />
          </Field>

          <Field label="Phone">
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
              required
            />
          </Field>

          <Field label="Rental months (min 5)">
            <input
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              type="number"
              min={5}
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
              required
            />
          </Field>

          <Field label="University">
            <input
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
              required
            />
          </Field>

          <Field label="Residence / Apartment">
            <input
              value={residence}
              onChange={(e) => setResidence(e.target.value)}
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
              required
            />
          </Field>
        </div>

        {/* delivery date */}
        <div className="mt-4">
          <Field label="Preferred delivery date">
            <input
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              type="date"
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
              required
            />
          </Field>
          <p className="mt-2 text-[12px] text-black/50">
            We will confirm the final time slot after we receive your documents and deposit.
          </p>
        </div>

        {/* uploads */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <Field label="Student card (required)">
              <input
                ref={studentCardRef}
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setStudentCard(e.target.files?.[0] ?? null)}
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
                required
              />
            </Field>
            <p className="mt-2 text-[12px] text-black/50">PNG/JPG/PDF • Max 2.5MB</p>
          </div>

          <div>
            <Field label="ID copy (required)">
              <input
                ref={idCopyRef}
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setIdCopy(e.target.files?.[0] ?? null)}
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
                required
              />
            </Field>
            <p className="mt-2 text-[12px] text-black/50">PNG/JPG/PDF • Max 2.5MB</p>
          </div>
        </div>

        {/* notes */}
        <div className="mt-4">
          <Field label="Notes (optional)">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
            />
          </Field>
        </div>

        {error && (
          <div className="mt-4 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-black/70">
            {error}
          </div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="mt-6 rounded-2xl border border-black/10 bg-white px-4 py-4"
          >
            <p className="text-xs font-semibold tracking-widest text-black/50">SUCCESS</p>
            <p className="mt-2 text-sm text-black/70">
              Reference number: <span className="font-semibold text-black">{result.reference}</span>
            </p>
            <p className="mt-1 text-xs text-black/50">Email sent: {result.emailed ? "Yes" : "Not configured yet"}</p>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <a
                href={`https://wa.me/27734921669?text=${encodeURIComponent(
                  `Hi, I submitted an order request. Reference: ${result.reference}. Please assist with next steps.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="water-hover vsp-focus inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-5 py-3 text-xs font-semibold tracking-widest text-black transition hover:bg-black/5"
              >
                Whatsapp With Ref
              </a>

              <Link
                href="/pricing"
                className="water-hover vsp-focus inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-5 py-3 text-xs font-semibold tracking-widest text-black transition hover:bg-black/5"
              >
                View Pricing
              </Link>
            </div>
          </motion.div>
        )}

        <div className="mt-6">
          <button
            type="button"
            disabled={loading}
            onClick={submit}
            className="water-hover vsp-focus inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-xs font-semibold tracking-widest text-white transition hover:opacity-95 disabled:opacity-60"
            style={{ backgroundColor: PRIMARY }}
          >
            {loading ? "Submitting..." : "Submit Order Request"}
          </button>
        </div>
      </div>

      {/* RIGHT: premium summary */}
      <div className="rounded-3xl border border-black/10 bg-white p-6">
        <p className="text-xs font-semibold tracking-widest text-black/50">ORDER SUMMARY</p>

        <div className="mt-4 space-y-3">
          {selectedPlans.length === 0 ? (
            <p className="text-sm text-black/60">Select appliances to see totals.</p>
          ) : (
            <>
              <div className="space-y-2">
                {selectedPlans.map((p) => (
                  <div key={p.slug} className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-black">{p.name}</p>
                      <p className="text-[12px] text-black/55">{p.monthly}</p>
                    </div>
                    <p className="text-sm font-semibold text-black">{moneyZAR(p.monthlyAmount)}</p>
                  </div>
                ))}
              </div>

              <div className="h-px w-full bg-black/10" />

              <Row label="Monthly total" value={moneyZAR(totals.monthlyTotal)} />
              <Row label="Deposit total (once-off)" value={moneyZAR(totals.depositTotal)} />
              <div className="h-px w-full bg-black/10" />
              <Row label="Total upfront (deposit)" value={moneyZAR(totals.upfrontTotal)} strong />

              <p className="mt-4 text-[12px] text-black/55">
                Banking details are sent by admin after your request. Your email will include your reference number and totals.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className={strong ? "text-sm font-semibold text-black" : "text-sm text-black/65"}>{label}</p>
      <p className={strong ? "text-sm font-semibold text-black" : "text-sm text-black"}>{value}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold tracking-widest text-black/50">{label.toUpperCase()}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}
