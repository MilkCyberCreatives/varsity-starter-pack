"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

const PRIMARY = "#c41a1a";

type Choice = "bar-fridge" | "microwave" | "top-freezer";

export default function AIRentalAssistantSection() {
  const [room, setRoom] = useState<"single" | "shared">("single");
  const [cook, setCook] = useState<"rare" | "often">("often");
  const [storage, setStorage] = useState<"low" | "high">("low");

  const rec: { slug: Choice; title: string; reason: string } = useMemo(() => {
    // Simple “AI” rules (we’ll upgrade to real AI later)
    if (storage === "high" || room === "shared") {
      return {
        slug: "top-freezer",
        title: "TOP FREEZER",
        reason: "best when you share or need extra storage for meal prep.",
      };
    }
    if (cook === "often") {
      return {
        slug: "microwave",
        title: "MICROWAVE",
        reason: "best for quick meals and everyday student routines.",
      };
    }
    return {
      slug: "bar-fridge",
      title: "BAR FRIDGE",
      reason: "best for keeping essentials cold in a single res room.",
    };
  }, [room, cook, storage]);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="grid gap-6 lg:grid-cols-2 lg:items-center"
        >
          <div>
            <p className="text-xs font-semibold tracking-widest text-black/50">
              AI RENTAL ASSISTANT
            </p>

            <h2 className="mt-3 text-3xl font-medium tracking-tight text-black sm:text-4xl">
              get the right appliance in 15 seconds
            </h2>

            <p className="mt-4 max-w-xl text-base text-black/65">
              answer 3 quick questions and we’ll recommend the best rental for
              your res life.
            </p>

            <div className="mt-8 grid gap-4">
              <Question
                label="room type"
                value={room}
                options={[
                  { v: "single", t: "single room" },
                  { v: "shared", t: "shared / apartment" },
                ]}
                onChange={(v) => setRoom(v as any)}
              />

              <Question
                label="cooking"
                value={cook}
                options={[
                  { v: "often", t: "i cook often" },
                  { v: "rare", t: "rarely cook" },
                ]}
                onChange={(v) => setCook(v as any)}
              />

              <Question
                label="storage needs"
                value={storage}
                options={[
                  { v: "low", t: "low" },
                  { v: "high", t: "high" },
                ]}
                onChange={(v) => setStorage(v as any)}
              />
            </div>
          </div>

          <div className="water-hover water-lift rounded-3xl border border-black/10 bg-white p-6">
            <p className="text-xs font-semibold tracking-widest text-black/50">
              RECOMMENDATION
            </p>

            <p className="mt-3 text-2xl font-semibold text-black">{rec.title}</p>

            <p className="mt-3 text-sm text-black/65">{rec.reason}</p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/order?appliance=${encodeURIComponent(rec.slug)}`}
                className="water-hover water-lift inline-flex items-center justify-center rounded-xl px-6 py-3 text-xs font-semibold tracking-widest text-white"
                style={{ backgroundColor: PRIMARY }}
              >
                REQUEST THIS OPTION
              </Link>

              <Link
                href="/pricing"
                className="water-hover inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-6 py-3 text-xs font-semibold tracking-widest text-black transition hover:bg-black/5"
              >
                VIEW PRICING
              </Link>
            </div>

            <p className="mt-6 text-xs text-black/45">
              next: we’ll add full AI chat for questions and instant quotes.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Question({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { v: string; t: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-5">
      <p className="text-xs font-semibold tracking-widest text-black/50">
        {label.toUpperCase()}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => {
          const active = value === o.v;
          return (
            <button
              key={o.v}
              type="button"
              onClick={() => onChange(o.v)}
              className="water-hover rounded-xl border px-4 py-2 text-xs font-semibold tracking-widest transition"
              style={{
                borderColor: active ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0.10)",
                backgroundColor: active ? "rgba(0,0,0,0.04)" : "white",
                color: "rgba(0,0,0,0.85)",
              }}
            >
              {o.t}
            </button>
          );
        })}
      </div>
    </div>
  );
}
