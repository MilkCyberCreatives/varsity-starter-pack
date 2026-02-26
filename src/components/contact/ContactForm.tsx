"use client";

import { useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";

type ContactPayload = {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  website: string;
  formStartedAt: number;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setHoverVars(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const mx = ((e.clientX - rect.left) / rect.width) * 100;
  const my = ((e.clientY - rect.top) / rect.height) * 100;
  el.style.setProperty("--mx", `${mx}%`);
  el.style.setProperty("--my", `${my}%`);
}

export default function ContactForm() {
  const startedAt = useRef<number>(Date.now());
  const [form, setForm] = useState<ContactPayload>({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    website: "",
    formStartedAt: startedAt.current,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validate = () => {
    if (!form.fullName.trim()) return "Full name is required.";
    if (!form.email.trim() || !EMAIL_RE.test(form.email.trim()))
      return "Valid email is required.";
    if (!form.phone.trim()) return "Phone number is required.";
    if (!form.subject.trim()) return "Subject is required.";
    if (!form.message.trim() || form.message.trim().length < 10)
      return "Message must be at least 10 characters.";
    return "";
  };

  const update = (key: keyof ContactPayload, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        reference?: string;
      };

      if (!response.ok || !data?.ok) {
        setError(data?.error || "Unable to submit your message right now.");
        return;
      }

      const reference = data.reference || "N/A";
      setSuccess(`Message sent. Reference: ${reference}`);
      trackEvent("submit_contact", { source: "contact_page", reference });
      startedAt.current = Date.now();
      setForm({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        website: "",
        formStartedAt: startedAt.current,
      });
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vsp-card rounded-3xl p-6">
      <p className="text-xs font-semibold tracking-widest text-white/76">CONTACT FORM</p>
      <p className="mt-3 text-sm text-white/84">
        Send your enquiry and we will respond as quickly as possible.
      </p>

      <form className="mt-5 grid gap-4" onSubmit={onSubmit} noValidate>
        <input
          type="text"
          name="website"
          autoComplete="off"
          tabIndex={-1}
          aria-hidden="true"
          value={form.website}
          onChange={(e) => update("website", e.target.value)}
          className="hidden"
        />

        <input
          type="text"
          required
          placeholder="Full Name"
          value={form.fullName}
          onChange={(e) => update("fullName", e.target.value)}
          className="vsp-focus h-12 rounded-xl border border-white/24 bg-white/12 px-4 text-sm text-white placeholder:text-white/60"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <input
            type="email"
            required
            placeholder="Email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="vsp-focus h-12 rounded-xl border border-white/24 bg-white/12 px-4 text-sm text-white placeholder:text-white/60"
          />
          <input
            type="tel"
            required
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="vsp-focus h-12 rounded-xl border border-white/24 bg-white/12 px-4 text-sm text-white placeholder:text-white/60"
          />
        </div>

        <input
          type="text"
          required
          placeholder="Subject"
          value={form.subject}
          onChange={(e) => update("subject", e.target.value)}
          className="vsp-focus h-12 rounded-xl border border-white/24 bg-white/12 px-4 text-sm text-white placeholder:text-white/60"
        />

        <textarea
          required
          rows={5}
          placeholder="Message"
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          className="vsp-focus rounded-xl border border-white/24 bg-white/12 px-4 py-3 text-sm text-white placeholder:text-white/60"
        />

        {error ? (
          <p className="rounded-xl border border-[#ffb5b5]/60 bg-[#6b0b0b]/45 px-4 py-3 text-sm text-[#ffe0e0]">
            {error}
          </p>
        ) : null}

        {success ? (
          <p className="rounded-xl border border-white/34 bg-white/16 px-4 py-3 text-sm text-white">
            {success}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          onMouseMove={setHoverVars}
          className="water-hover water-lift vsp-focus inline-flex h-11 items-center justify-center rounded-xl border border-white/26 bg-white px-6 text-xs font-semibold tracking-widest text-[rgb(var(--vsp-red))] disabled:cursor-not-allowed disabled:opacity-65"
        >
          {loading ? "SENDING..." : "SEND MESSAGE"}
        </button>
      </form>
    </div>
  );
}
