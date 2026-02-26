"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { PLANS, isApplianceSlug, type ApplianceSlug } from "@/lib/plans";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

const PRIMARY = "#b01414";
const ORDER_DRAFT_KEY = "vsp.order.draft.v1";
const ORDER_PROFILE_KEY = "vsp.order.profile.v1";
const MAX_UPLOAD_BYTES = 2.5 * 1024 * 1024;

type Props = {
  selectedSlugs: ApplianceSlug[];
  initialMonths?: number;
};

type SmartNeeds = {
  room: "single" | "shared";
  cooking: "rare" | "often";
  storage: "low" | "high";
  budget: "tight" | "balanced" | "flexible";
};

type SmartRecommendation = {
  slugs: ApplianceSlug[];
  months: number;
  profile: string;
  reason: string;
};

type DraftPayload = {
  appliances: ApplianceSlug[];
  fullName: string;
  email: string;
  phone: string;
  university: string;
  residence: string;
  months: number;
  deliveryDate: string;
  notes: string;
  needs: SmartNeeds;
  savedAt: number;
};

type ProfilePayload = {
  fullName: string;
  email: string;
  phone: string;
  university: string;
  residence: string;
};

type ApiOk = {
  ok: true;
  reference: string;
  emailed: boolean;
  duplicate?: boolean;
  selected: {
    slugs: ApplianceSlug[];
    items: { slug: ApplianceSlug; name: string; monthly: string; deposit: string }[];
    totals: { monthlyTotal: number; depositTotal: number; upfrontTotal: number };
  };
};

type ApiErr = { ok: false; error: string };

const DEFAULT_NEEDS: SmartNeeds = {
  room: "single",
  cooking: "often",
  storage: "low",
  budget: "balanced",
};

function moneyZAR(n: number) {
  return `R${n.toLocaleString("en-ZA")}`;
}

function uniqueSlugs(values: ApplianceSlug[]) {
  return Array.from(new Set(values));
}

function clampMonths(value?: number) {
  if (!Number.isFinite(value)) return 5;
  return Math.min(36, Math.max(5, Math.floor(value ?? 5)));
}

function extractTotals(slugs: ApplianceSlug[]) {
  const selectedPlans = PLANS.filter((plan) => slugs.includes(plan.slug));
  return selectedPlans.reduce(
    (acc, plan) => {
      acc.monthlyTotal += plan.monthlyAmount;
      acc.depositTotal += plan.depositAmount;
      return acc;
    },
    { monthlyTotal: 0, depositTotal: 0 }
  );
}

function buildRecommendation(needs: SmartNeeds): SmartRecommendation {
  let slugs: ApplianceSlug[] = [];

  if (needs.storage === "high" || needs.room === "shared") {
    slugs.push("top-freezer");
  } else {
    slugs.push("bar-fridge");
  }

  if (needs.cooking === "often") {
    slugs.push("microwave");
  }

  if (needs.budget === "flexible") {
    slugs = ["bar-fridge", "microwave", "top-freezer"];
  } else if (
    needs.budget === "tight" &&
    slugs.includes("top-freezer") &&
    !slugs.includes("microwave")
  ) {
    slugs = ["bar-fridge"];
  }

  const unique = uniqueSlugs(slugs);
  const monthsBase = needs.budget === "tight" ? 5 : needs.budget === "balanced" ? 7 : 10;
  const months = clampMonths(monthsBase + (needs.room === "shared" ? 1 : 0));
  const profile =
    needs.room === "shared"
      ? "Shared living setup"
      : needs.cooking === "often"
        ? "Daily cooking setup"
        : "Essentials setup";
  const reason =
    needs.budget === "tight"
      ? "Focuses on core essentials with the lowest monthly commitment."
      : needs.budget === "flexible"
        ? "Balances storage and convenience for a complete student setup."
        : "Keeps a balanced monthly cost with practical everyday convenience.";

  return { slugs: unique, months, profile, reason };
}

async function fileToBase64(file: File) {
  const buf = await file.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.byteLength; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

export default function OrderForm({ selectedSlugs, initialMonths }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [appliances, setAppliances] = useState<ApplianceSlug[]>(selectedSlugs ?? []);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [university, setUniversity] = useState("");
  const [residence, setResidence] = useState("");
  const [months, setMonths] = useState<number>(clampMonths(initialMonths));
  const [deliveryDate, setDeliveryDate] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [website, setWebsite] = useState("");
  const [needs, setNeeds] = useState<SmartNeeds>(DEFAULT_NEEDS);
  const [loadedDraftMessage, setLoadedDraftMessage] = useState<string | null>(null);
  const [formStartedAt] = useState<number>(() => Date.now());

  const [studentCard, setStudentCard] = useState<File | null>(null);
  const [idCopy, setIdCopy] = useState<File | null>(null);

  const studentCardRef = useRef<HTMLInputElement | null>(null);
  const idCopyRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiOk | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recommendation = useMemo(() => buildRecommendation(needs), [needs]);
  const recommendationTotals = useMemo(
    () => extractTotals(recommendation.slugs),
    [recommendation.slugs]
  );

  const selectedPlans = useMemo(() => {
    const set = new Set(appliances);
    return PLANS.filter((p) => set.has(p.slug));
  }, [appliances]);

  const totals = useMemo(() => {
    const monthlyTotal = selectedPlans.reduce((sum, p) => sum + p.monthlyAmount, 0);
    const depositTotal = selectedPlans.reduce((sum, p) => sum + p.depositAmount, 0);
    const upfrontTotal = depositTotal;
    return { monthlyTotal, depositTotal, upfrontTotal };
  }, [selectedPlans]);

  function syncUrl(nextAppliances: ApplianceSlug[], nextMonths = months) {
    const params = new URLSearchParams(searchParams?.toString());
    if (nextAppliances.length) params.set("appliance", nextAppliances.join(","));
    else params.delete("appliance");
    params.set("months", String(clampMonths(nextMonths)));
    router.replace(`/order?${params.toString()}`, { scroll: false });
  }

  function setMonthsAndSync(nextValue: number) {
    const next = clampMonths(nextValue);
    setMonths(next);
    syncUrl(appliances, next);
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

  function applyRecommendation() {
    setResult(null);
    setError(null);
    const nextSlugs = uniqueSlugs(recommendation.slugs);
    setAppliances(nextSlugs);
    setMonths(recommendation.months);
    syncUrl(nextSlugs, recommendation.months);
  }

  function loadSavedProfile() {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(ORDER_PROFILE_KEY);
    if (!raw) return;
    try {
      const profile = JSON.parse(raw) as ProfilePayload;
      setFullName(profile.fullName || "");
      setEmail(profile.email || "");
      setPhone(profile.phone || "");
      setUniversity(profile.university || "");
      setResidence(profile.residence || "");
      setLoadedDraftMessage("Saved details applied.");
    } catch {
      return;
    }
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
    if (studentCard.size > MAX_UPLOAD_BYTES || idCopy.size > MAX_UPLOAD_BYTES) {
      return "Uploads must be under 2.5MB each (use a photo/compressed PDF).";
    }
    return null;
  }

  useEffect(() => {
    if (typeof window === "undefined") return;

    const rawDraft = window.localStorage.getItem(ORDER_DRAFT_KEY);
    const rawProfile = window.localStorage.getItem(ORDER_PROFILE_KEY);

    if (rawDraft) {
      try {
        const draft = JSON.parse(rawDraft) as DraftPayload;
        const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
        if (Number.isFinite(draft.savedAt) && Date.now() - draft.savedAt < sevenDaysMs) {
          const nextSlugs = Array.isArray(draft.appliances)
            ? draft.appliances.filter((slug): slug is ApplianceSlug => isApplianceSlug(slug))
            : [];
          if (nextSlugs.length) {
            setAppliances(nextSlugs);
          }

          setFullName(draft.fullName || "");
          setEmail(draft.email || "");
          setPhone(draft.phone || "");
          setUniversity(draft.university || "");
          setResidence(draft.residence || "");
          setMonths(clampMonths(draft.months));
          setDeliveryDate(draft.deliveryDate || "");
          setNotes(draft.notes || "");
          if (draft.needs) {
            setNeeds({
              room: draft.needs.room || "single",
              cooking: draft.needs.cooking || "often",
              storage: draft.needs.storage || "low",
              budget: draft.needs.budget || "balanced",
            });
          }

          setLoadedDraftMessage("Draft restored from your previous visit.");
          return;
        }
      } catch {
        window.localStorage.removeItem(ORDER_DRAFT_KEY);
      }
    }

    if (rawProfile) {
      try {
        const profile = JSON.parse(rawProfile) as ProfilePayload;
        if (profile.fullName || profile.email || profile.phone) {
          setFullName(profile.fullName || "");
          setEmail(profile.email || "");
          setPhone(profile.phone || "");
          setUniversity(profile.university || "");
          setResidence(profile.residence || "");
          setLoadedDraftMessage("Saved details loaded.");
        }
      } catch {
        window.localStorage.removeItem(ORDER_PROFILE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const payload: DraftPayload = {
      appliances,
      fullName,
      email,
      phone,
      university,
      residence,
      months: clampMonths(months),
      deliveryDate,
      notes,
      needs,
      savedAt: Date.now(),
    };
    window.localStorage.setItem(ORDER_DRAFT_KEY, JSON.stringify(payload));
  }, [
    appliances,
    fullName,
    email,
    phone,
    university,
    residence,
    months,
    deliveryDate,
    notes,
    needs,
  ]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasProfile = fullName || email || phone || university || residence;
    if (!hasProfile) return;
    const payload: ProfilePayload = { fullName, email, phone, university, residence };
    window.localStorage.setItem(ORDER_PROFILE_KEY, JSON.stringify(payload));
  }, [fullName, email, phone, university, residence]);

  async function submit() {
    if (loading) return;
    setError(null);
    setLoadedDraftMessage(null);

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
          website,
          formStartedAt,
          smart: {
            profile: recommendation.profile,
            reason: recommendation.reason,
            selectedByGuide: recommendation.slugs,
            needs,
          },
          uploads: {
            studentCard: studentCard
              ? {
                  name: studentCard.name,
                  type: studentCard.type || "application/octet-stream",
                  base64: studentCardB64,
                }
              : null,
            idCopy: idCopy
              ? {
                  name: idCopy.name,
                  type: idCopy.type || "application/octet-stream",
                  base64: idCopyB64,
                }
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

      if (typeof window !== "undefined") {
        window.localStorage.removeItem(ORDER_DRAFT_KEY);
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
      <div className="vsp-card-strong rounded-3xl p-6">
        <p className="text-sm text-white/88">
          Complete your order details and documents. You will receive a reference number and next steps by email.
        </p>

        <div className="mt-6 grid gap-3 rounded-2xl border border-white/24 bg-white/8 p-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold tracking-widest text-white/72">SMART SETUP</p>
            <p className="mt-1 text-sm text-white/90">
              Get a setup suggestion based on your room, cooking habits, and budget.
            </p>
          </div>

          <div className="flex items-start justify-end">
            <button
              type="button"
              onClick={loadSavedProfile}
              className="water-hover vsp-focus rounded-xl border border-white/30 bg-white/16 px-4 py-2 text-[11px] font-semibold tracking-widest text-white/95 hover:bg-white/22"
            >
              USE SAVED DETAILS
            </button>
          </div>

          <SmartRow
            label="Room type"
            value={needs.room}
            options={[
              { value: "single", label: "Single Room" },
              { value: "shared", label: "Shared / Apartment" },
            ]}
            onChange={(value) => setNeeds((prev) => ({ ...prev, room: value }))}
          />

          <SmartRow
            label="Cooking"
            value={needs.cooking}
            options={[
              { value: "often", label: "Cook Often" },
              { value: "rare", label: "Cook Rarely" },
            ]}
            onChange={(value) => setNeeds((prev) => ({ ...prev, cooking: value }))}
          />

          <SmartRow
            label="Storage need"
            value={needs.storage}
            options={[
              { value: "low", label: "Low" },
              { value: "high", label: "High" },
            ]}
            onChange={(value) => setNeeds((prev) => ({ ...prev, storage: value }))}
          />

          <SmartRow
            label="Budget mode"
            value={needs.budget}
            options={[
              { value: "tight", label: "Tight" },
              { value: "balanced", label: "Balanced" },
              { value: "flexible", label: "Flexible" },
            ]}
            onChange={(value) => setNeeds((prev) => ({ ...prev, budget: value }))}
          />
        </div>

        <div className="mt-4 rounded-2xl border border-white/28 bg-white/12 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-widest text-white/76">SUGGESTED SETUP</p>
              <p className="mt-1 text-sm font-semibold text-white">{recommendation.profile}</p>
              <p className="mt-1 text-xs text-white/80">{recommendation.reason}</p>
            </div>
            <button
              type="button"
              onClick={applyRecommendation}
              className="water-hover vsp-focus rounded-xl border border-white/28 bg-white/18 px-4 py-2 text-[11px] font-semibold tracking-widest text-white hover:bg-white/24"
            >
              APPLY SUGGESTION
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {recommendation.slugs.map((slug) => {
              const plan = PLANS.find((item) => item.slug === slug);
              if (!plan) return null;
              return (
                <span
                  key={slug}
                  className="rounded-full border border-white/24 bg-white/16 px-3 py-1 text-[11px] font-semibold tracking-widest text-white"
                >
                  {plan.name.toUpperCase()}
                </span>
              );
            })}
            <span className="rounded-full border border-white/24 bg-white/16 px-3 py-1 text-[11px] font-semibold tracking-widest text-white">
              {recommendation.months} MONTHS
            </span>
          </div>
          <p className="mt-2 text-[11px] text-white/74">
            Suggested monthly: {moneyZAR(recommendationTotals.monthlyTotal)} | Suggested deposit:{" "}
            {moneyZAR(recommendationTotals.depositTotal)}
          </p>
        </div>

        <div className="mt-6">
          <p className="text-xs font-semibold tracking-widest text-white/72">SELECT APPLIANCES</p>

          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {PLANS.map((p) => {
              const active = appliances.includes(p.slug);
              return (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => toggleAppliance(p.slug)}
                  data-selected={active ? "1" : "0"}
                  className={[
                    "water-hover vsp-borderflow vsp-sheen vsp-focus",
                    "rounded-2xl border border-white/28 bg-white px-4 py-4 text-left transition hover:bg-white/96",
                  ].join(" ")}
                  style={{ outline: "none" }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-[13px] font-semibold text-black">{p.name}</div>
                    {active ? (
                      <span
                        className="rounded-full px-2 py-1 text-[10px] font-semibold tracking-widest"
                        style={{ backgroundColor: "rgba(176,20,20,0.14)", color: PRIMARY }}
                      >
                        SELECTED
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold tracking-widest text-black/40">ADD</span>
                    )}
                  </div>

                  <div className="mt-2 text-[11px] text-black/62">{p.monthly}</div>
                  <div className="mt-1 text-[11px] text-black/45">{p.deposit}</div>

                  <div
                    className="mt-4 h-[3px] rounded-full transition"
                    style={{
                      width: active ? "100%" : "48px",
                      background: active
                        ? "linear-gradient(90deg, rgba(176,20,20,0.18), rgba(176,20,20,0.9) 50%, rgba(176,20,20,0.18))"
                        : "linear-gradient(90deg, rgba(0,0,0,0.05), rgba(0,0,0,0.16), rgba(0,0,0,0.05))",
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Full name">
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-white/34 bg-white/95 px-4 py-3 text-sm text-black outline-none"
              required
            />
          </Field>

          <Field label="Email">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full rounded-xl border border-white/34 bg-white/95 px-4 py-3 text-sm text-black outline-none"
              required
            />
          </Field>

          <Field label="Phone">
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-white/34 bg-white/95 px-4 py-3 text-sm text-black outline-none"
              required
            />
          </Field>

          <Field label="Rental months (min 5)">
            <input
              value={months}
              onChange={(e) => setMonthsAndSync(Number(e.target.value))}
              type="number"
              min={5}
              max={36}
              className="w-full rounded-xl border border-white/34 bg-white/95 px-4 py-3 text-sm text-black outline-none"
              required
            />
          </Field>

          <Field label="University">
            <input
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="w-full rounded-xl border border-white/34 bg-white/95 px-4 py-3 text-sm text-black outline-none"
              required
            />
          </Field>

          <Field label="Residence / Apartment">
            <input
              value={residence}
              onChange={(e) => setResidence(e.target.value)}
              className="w-full rounded-xl border border-white/34 bg-white/95 px-4 py-3 text-sm text-black outline-none"
              required
            />
          </Field>
        </div>

        <div className="mt-4">
          <Field label="Preferred delivery date">
            <input
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              type="date"
              className="w-full rounded-xl border border-white/34 bg-white/95 px-4 py-3 text-sm text-black outline-none"
              required
            />
          </Field>
          <p className="mt-2 text-[12px] text-white/72">
            Final time slots are confirmed after document checks and deposit confirmation.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <Field label="Student card (required)">
              <input
                ref={studentCardRef}
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setStudentCard(e.target.files?.[0] ?? null)}
                className="w-full rounded-xl border border-white/34 bg-white/95 px-4 py-3 text-sm text-black outline-none"
                required
              />
            </Field>
            <p className="mt-2 text-[12px] text-white/72">PNG/JPG/PDF | Max 2.5MB</p>
          </div>

          <div>
            <Field label="ID copy (required)">
              <input
                ref={idCopyRef}
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setIdCopy(e.target.files?.[0] ?? null)}
                className="w-full rounded-xl border border-white/34 bg-white/95 px-4 py-3 text-sm text-black outline-none"
                required
              />
            </Field>
            <p className="mt-2 text-[12px] text-white/72">PNG/JPG/PDF | Max 2.5MB</p>
          </div>
        </div>

        <div className="mt-4">
          <Field label="Notes (optional)">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-white/34 bg-white/95 px-4 py-3 text-sm text-black outline-none"
            />
          </Field>
        </div>

        <input
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="sr-only"
          aria-hidden="true"
        />

        {loadedDraftMessage && (
          <div className="mt-4 rounded-2xl border border-white/24 bg-white/12 px-4 py-3 text-sm text-white/86">
            {loadedDraftMessage}
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-2xl border border-white/24 bg-white/12 px-4 py-3 text-sm text-white/86">
            {error}
          </div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="mt-6 rounded-2xl border border-white/28 bg-white/16 px-4 py-4"
          >
            <p className="text-xs font-semibold tracking-widest text-white/74">SUCCESS</p>
            <p className="mt-2 text-sm text-white/92">
              Reference number: <span className="font-semibold text-white">{result.reference}</span>
            </p>
            <p className="mt-1 text-xs text-white/72">
              Email sent: {result.emailed ? "Yes" : "Not configured yet"}
            </p>
            {result.duplicate ? (
              <p className="mt-1 text-xs text-white/72">
                A recent matching request was found, so we kept your existing reference number.
              </p>
            ) : null}

            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <a
                href={`https://wa.me/27734921669?text=${encodeURIComponent(
                  `Hi, I submitted an order request. Reference: ${result.reference}. Please assist with next steps.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="water-hover vsp-focus inline-flex items-center justify-center rounded-xl border border-white/26 bg-white/20 px-5 py-3 text-xs font-semibold tracking-widest text-white transition hover:bg-white/26"
              >
                WhatsApp With Ref
              </a>

              <Link
                href="/pricing"
                className="water-hover vsp-focus inline-flex items-center justify-center rounded-xl border border-white/26 bg-white/20 px-5 py-3 text-xs font-semibold tracking-widest text-white transition hover:bg-white/26"
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
            className="water-hover vsp-focus inline-flex w-full items-center justify-center rounded-xl border border-white/30 px-5 py-3 text-xs font-semibold tracking-widest text-white transition hover:opacity-95 disabled:opacity-60"
            style={{ backgroundColor: PRIMARY }}
          >
            {loading ? "Submitting..." : "Submit Order Request"}
          </button>
        </div>
      </div>

      <div className="vsp-panel rounded-3xl p-6">
        <p className="text-xs font-semibold tracking-widest text-white/76">ORDER SUMMARY</p>

        <div className="mt-4 space-y-3">
          {selectedPlans.length === 0 ? (
            <p className="text-sm text-white/80">Select appliances to see totals.</p>
          ) : (
            <>
              <div className="space-y-2">
                {selectedPlans.map((p) => (
                  <div key={p.slug} className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{p.name}</p>
                      <p className="text-[12px] text-white/72">{p.monthly}</p>
                    </div>
                    <p className="text-sm font-semibold text-white">{moneyZAR(p.monthlyAmount)}</p>
                  </div>
                ))}
              </div>

              <div className="vsp-seam" />

              <Row label="Monthly total" value={moneyZAR(totals.monthlyTotal)} />
              <Row label="Deposit total (once-off)" value={moneyZAR(totals.depositTotal)} />
              <div className="vsp-seam" />
              <Row label="Total upfront (deposit)" value={moneyZAR(totals.upfrontTotal)} strong />

              <p className="mt-4 text-[12px] text-white/70">
                Banking details are sent by admin after your request. Your email includes reference number and totals.
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
      <p className={strong ? "text-sm font-semibold text-white" : "text-sm text-white/78"}>{label}</p>
      <p className={strong ? "text-sm font-semibold text-white" : "text-sm text-white"}>{value}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold tracking-widest text-white/72">{label.toUpperCase()}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function SmartRow<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold tracking-widest text-white/70">{label.toUpperCase()}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => {
          const active = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className="water-hover vsp-focus rounded-xl border px-3 py-2 text-[11px] font-semibold tracking-widest transition"
              style={{
                borderColor: active ? "rgba(255,255,255,0.56)" : "rgba(255,255,255,0.24)",
                backgroundColor: active ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.95)",
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
