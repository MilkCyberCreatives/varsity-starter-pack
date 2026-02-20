"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { PLANS } from "@/lib/plans";
import { siteConfig } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";

const CONSENT_KEY = "vsp_cookie_consent_v1";

type Message = {
  id: string;
  from: "assistant" | "user";
  text: string;
};

function hasCookieDecision() {
  if (typeof window === "undefined") return true;
  const value = window.localStorage.getItem(CONSENT_KEY);
  return value === "accepted" || value === "declined";
}

function parseCurrency(value: string) {
  return Number(value.replace(/[^\d]/g, "")) || 0;
}

function createReply(text: string) {
  const q = text.toLowerCase().trim();
  const planSummary = PLANS.map((plan) => `${plan.name}: ${plan.monthly} (${plan.deposit})`).join(" | ");

  if (q.includes("price") || q.includes("pricing") || q.includes("cost") || q.includes("monthly")) {
    return `Current rates: ${planSummary}.`;
  }

  if (q.includes("deposit") || q.includes("due now")) {
    return "Total due now is the refundable deposit total for selected appliances.";
  }

  if (q.includes("minimum") || q.includes("month") || q.includes("period")) {
    return "Minimum rental period is 5 months.";
  }

  if (q.includes("delivery") || q.includes("area") || q.includes("where")) {
    return "Delivery covers res and apartments in Gauteng (terms apply).";
  }

  if (q.includes("maintenance") || q.includes("repair") || q.includes("support")) {
    return "Maintenance is included during your rental period.";
  }

  if (q.includes("multiple") || q.includes("more than one") || q.includes("combo")) {
    return "Yes, you can select multiple appliances in one order request.";
  }

  if (q.includes("order") || q.includes("reference") || q.includes("submit")) {
    return "Submit the order form with all required details. You will receive a unique reference number by email.";
  }

  if (q.includes("contact") || q.includes("whatsapp") || q.includes("phone")) {
    return `WhatsApp: ${siteConfig.phonePrimary}. Secondary: ${siteConfig.phoneSecondary}. Email: ${siteConfig.supportEmail}.`;
  }

  if (q.includes("total")) {
    const monthlyTotal = PLANS.reduce((sum, plan) => sum + parseCurrency(plan.monthly), 0);
    const depositTotal = PLANS.reduce((sum, plan) => sum + plan.depositAmount, 0);
    return `If selecting all appliances: Monthly total is R${monthlyTotal}. Deposit total is R${depositTotal}. Total due now is R${depositTotal}.`;
  }

  return "I can help with pricing, deposits, delivery, order steps, and contact details.";
}

export default function VirtualAssistantButton() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [input, setInput] = useState("");
  const [cookieSet, setCookieSet] = useState(true);
  const idCounter = useRef(1);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      from: "assistant",
      text: "Hello. Ask me about pricing, delivery, deposits, or how to request an order.",
    },
  ]);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 0);
    };

    const updateCookieState = () => {
      setCookieSet(hasCookieDecision());
    };

    onScroll();
    updateCookieState();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("storage", updateCookieState);
    window.addEventListener("vsp-consent-change", updateCookieState);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("storage", updateCookieState);
      window.removeEventListener("vsp-consent-change", updateCookieState);
    };
  }, []);

  useEffect(() => {
    if (!open || !listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open]);

  const quickActions = useMemo(
    () => ["Pricing", "Deposit total", "Delivery areas", "How to order"],
    []
  );

  const submitQuestion = (value: string) => {
    const question = value.trim();
    if (!question) return;
    const nextId = idCounter.current;
    idCounter.current += 1;

    const userMessage: Message = {
      id: `u-${nextId}`,
      from: "user",
      text: question,
    };
    const assistantMessage: Message = {
      id: `a-${nextId}`,
      from: "assistant",
      text: createReply(question),
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput("");
    trackEvent("open_virtual_assistant", { action: "ask_question" });
  };

  if (!visible && !open) return null;

  return (
    <>
      {open ? (
        <aside
          className={[
            "fixed left-4 z-[96] w-[min(92vw,360px)] overflow-hidden rounded-2xl border border-white/28 bg-[rgb(132,10,10)]/62 backdrop-blur-md sm:left-6",
            cookieSet ? "bottom-20 sm:bottom-24" : "bottom-32 sm:bottom-36",
          ].join(" ")}
          aria-label="Virtual assistant"
        >
          <div className="flex items-center justify-between border-b border-white/20 px-4 py-3">
            <p className="text-xs font-semibold tracking-widest text-white/86">VIRTUAL ASSISTANT</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="water-hover vsp-focus rounded-lg border border-white/24 bg-white/12 px-2 py-1 text-[10px] font-semibold tracking-widest text-white"
            >
              CLOSE
            </button>
          </div>

          <div ref={listRef} className="max-h-[300px] space-y-2 overflow-y-auto px-3 py-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={[
                  "max-w-[92%] rounded-xl border px-3 py-2 text-sm leading-relaxed",
                  msg.from === "assistant"
                    ? "border-white/20 bg-white/10 text-white/88"
                    : "ml-auto border-white/34 bg-white text-[rgb(var(--vsp-red-deep))]",
                ].join(" ")}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="border-t border-white/20 px-3 pb-3 pt-2">
            <div className="mb-2 flex flex-wrap gap-2">
              {quickActions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => submitQuestion(item)}
                  className="water-hover vsp-focus rounded-full border border-white/22 bg-white/10 px-2.5 py-1 text-[10px] font-semibold tracking-widest text-white/84"
                >
                  {item}
                </button>
              ))}
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                submitQuestion(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Type your question..."
                className="vsp-focus h-10 w-full rounded-xl border border-white/24 bg-white/12 px-3 text-sm text-white placeholder:text-white/56"
              />
              <button
                type="submit"
                className="water-hover vsp-focus h-10 rounded-xl border border-white/24 bg-white px-3 text-xs font-semibold tracking-widest text-[rgb(var(--vsp-red))]"
              >
                SEND
              </button>
            </form>

            <div className="mt-3 flex items-center justify-between text-[11px] text-white/76">
              <Link href="/order" className="hover:text-white">
                REQUEST ORDER
              </Link>
              <a href={`https://wa.me/${siteConfig.whatsappNumber}`} target="_blank" rel="noreferrer" className="hover:text-white">
                WHATSAPP
              </a>
            </div>
          </div>
        </aside>
      ) : null}

      <button
        type="button"
        onClick={() => {
          setOpen((prev) => !prev);
          trackEvent("open_virtual_assistant", { action: "toggle" });
        }}
        aria-label="Open virtual assistant"
        className={[
          "water-hover water-lift vsp-focus fixed left-5 z-[95] inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/28 bg-white/16 px-4 text-xs font-semibold tracking-widest text-white backdrop-blur-md sm:left-7",
          cookieSet ? "bottom-5 sm:bottom-7" : "bottom-24 sm:bottom-28",
        ].join(" ")}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
          <path d="M4 4h16v11H7.8L4 18.4V4zm2 2v7.6l1.2-1.2H18V6H6zm2.5 2h7v2h-7V8z" />
        </svg>
        ASSIST
      </button>
    </>
  );
}
