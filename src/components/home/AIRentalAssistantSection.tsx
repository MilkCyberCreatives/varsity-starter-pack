"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { PLANS, type ApplianceSlug } from "@/lib/plans";

type Room = "single" | "shared";
type Cook = "rare" | "often";
type Storage = "low" | "high";
type Budget = "tight" | "balanced" | "flexible";

type SetupChoice = {
  slugs: ApplianceSlug[];
  months: number;
  title: string;
  reason: string;
};

function moneyZAR(value: number) {
  return `R${value.toLocaleString("en-ZA")}`;
}

function buildSetup(room: Room, cook: Cook, storage: Storage, budget: Budget): SetupChoice {
  let slugs: ApplianceSlug[] = [];

  if (storage === "high" || room === "shared") {
    slugs.push("top-freezer");
  } else {
    slugs.push("bar-fridge");
  }

  if (cook === "often") {
    slugs.push("microwave");
  }

  if (budget === "flexible") {
    slugs = ["bar-fridge", "microwave", "top-freezer"];
  } else if (budget === "tight" && slugs.includes("top-freezer") && !slugs.includes("microwave")) {
    slugs = ["bar-fridge"];
  }

  const unique = Array.from(new Set(slugs));
  const monthsBase = budget === "tight" ? 5 : budget === "balanced" ? 7 : 10;
  const months = Math.min(36, Math.max(5, monthsBase + (room === "shared" ? 1 : 0)));
  const title =
    room === "shared" ? "Shared living setup" : cook === "often" ? "Daily cooking setup" : "Essentials setup";
  const reason =
    budget === "tight"
      ? "Lower monthly commitment with practical essentials."
      : budget === "flexible"
        ? "Complete setup for convenience, storage, and flexibility."
        : "Balanced setup for day-to-day student living.";

  return { slugs: unique, months, title, reason };
}

export default function AIRentalAssistantSection() {
  const [room, setRoom] = useState<Room>("single");
  const [cook, setCook] = useState<Cook>("often");
  const [storage, setStorage] = useState<Storage>("low");
  const [budget, setBudget] = useState<Budget>("balanced");

  const setup = useMemo(
    () => buildSetup(room, cook, storage, budget),
    [room, cook, storage, budget]
  );

  const totals = useMemo(() => {
    return setup.slugs.reduce(
      (acc, slug) => {
        const plan = PLANS.find((item) => item.slug === slug);
        if (!plan) return acc;
        acc.monthly += plan.monthlyAmount;
        acc.deposit += plan.depositAmount;
        return acc;
      },
      { monthly: 0, deposit: 0 }
    );
  }, [setup.slugs]);

  const orderHref = `/order?appliance=${encodeURIComponent(setup.slugs.join(","))}&months=${setup.months}`;

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.22 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]"
      >
        <div className="vsp-panel rounded-3xl p-6 sm:p-8">
          <p className="text-xs font-semibold tracking-widest text-white/74">SETUP MATCHER</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Build your best varsity setup in seconds
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-white/80">
            Choose your room style, cooking habits, and budget. We will prepare a setup with total monthly and deposit numbers.
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <OptionGroup
              label="Room"
              value={room}
              options={[
                { value: "single", text: "Single Room" },
                { value: "shared", text: "Shared / Apartment" },
              ]}
              onChange={setRoom}
            />

            <OptionGroup
              label="Cooking"
              value={cook}
              options={[
                { value: "often", text: "Cook Often" },
                { value: "rare", text: "Cook Rarely" },
              ]}
              onChange={setCook}
            />

            <OptionGroup
              label="Storage Need"
              value={storage}
              options={[
                { value: "low", text: "Low" },
                { value: "high", text: "High" },
              ]}
              onChange={setStorage}
            />

            <OptionGroup
              label="Budget"
              value={budget}
              options={[
                { value: "tight", text: "Tight" },
                { value: "balanced", text: "Balanced" },
                { value: "flexible", text: "Flexible" },
              ]}
              onChange={setBudget}
            />
          </div>
        </div>

        <div className="vsp-card-strong rounded-3xl p-6">
          <p className="text-xs font-semibold tracking-widest text-white/74">RECOMMENDED SETUP</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">{setup.title}</h3>
          <p className="mt-2 text-sm text-white/80">{setup.reason}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {setup.slugs.map((slug) => {
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
              {setup.months} MONTHS
            </span>
          </div>

          <div className="mt-5 space-y-2 text-sm">
            <div className="flex items-center justify-between gap-3 text-white/84">
              <span>Monthly total</span>
              <strong className="text-white">{moneyZAR(totals.monthly)}</strong>
            </div>
            <div className="flex items-center justify-between gap-3 text-white/84">
              <span>Deposit total</span>
              <strong className="text-white">{moneyZAR(totals.deposit)}</strong>
            </div>
            <div className="vsp-seam" />
            <div className="flex items-center justify-between gap-3 text-white">
              <span>Total due now</span>
              <strong>{moneyZAR(totals.deposit)}</strong>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Link
              href={orderHref}
              className="water-hover vsp-focus inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/22 px-5 py-3 text-xs font-semibold tracking-widest text-white hover:bg-white/30"
            >
              APPLY TO ORDER
            </Link>
            <Link
              href="/pricing"
              className="water-hover vsp-focus inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/14 px-5 py-3 text-xs font-semibold tracking-widest text-white hover:bg-white/20"
            >
              VIEW PRICING
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function OptionGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; text: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold tracking-widest text-white/72">{label.toUpperCase()}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className="water-hover vsp-focus rounded-xl border px-3 py-2 text-[11px] font-semibold tracking-widest transition"
              style={{
                borderColor: active ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.24)",
                backgroundColor: active ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.95)",
              }}
            >
              {option.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
