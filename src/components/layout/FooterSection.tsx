import Image from "next/image";
import Link from "next/link";
import TrackedExternalLink from "@/components/marketing/TrackedExternalLink";
import { siteConfig } from "@/lib/site";

const LINKS = [
  { label: "HOME", href: "/" },
  { label: "PRICING", href: "/pricing" },
  { label: "HOW IT WORKS", href: "/how-it-works" },
  { label: "DELIVERIES", href: "/deliveries" },
  { label: "FAQ", href: "/faq" },
  { label: "CONTACT", href: "/contact" },
  { label: "ORDER", href: "/order" },
];

export default function FooterSection() {
  const year = new Date().getUTCFullYear();

  return (
    <footer className="relative z-20 mt-auto mb-0 overflow-hidden bg-[rgb(var(--vsp-red-deep))] pb-0 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-20 before:bg-[linear-gradient(180deg,rgba(176,20,20,0.28),rgba(176,20,20,0))]">
      <div className="relative mx-auto max-w-6xl px-4 pb-0 pt-10 sm:pt-12">
        <div className="grid gap-10 border-b border-white/20 pb-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Image
              src="/logo2.svg"
              alt="Varsity Starter Pack"
              width={170}
              height={38}
              sizes="170px"
            />

            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/84">
              Student-only appliance rentals in Gauteng with maintenance included
              and reliable delivery to res and apartments.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <TrackedExternalLink
                href={`https://wa.me/${siteConfig.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                eventName="click_whatsapp"
                payload={{ source: "footer" }}
                className="water-hover water-lift vsp-focus inline-flex items-center justify-center rounded-xl border border-white/25 bg-white px-6 py-3 text-xs font-semibold tracking-widest text-[rgb(var(--vsp-red))]"
              >
                WHATSAPP US
              </TrackedExternalLink>

              <Link
                href="/order"
                className="water-hover vsp-focus inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/16 px-6 py-3 text-xs font-semibold tracking-widest text-white hover:bg-white/24"
              >
                REQUEST ORDER
              </Link>
            </div>

            <p className="mt-5 text-xs text-white/74">
              minimum rental: 5 months, refundable deposits (less damages)
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="text-xs font-semibold tracking-widest text-white/74">
              QUICK LINKS
            </p>
            <ul className="mt-4 space-y-2.5">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="inline-flex text-sm font-semibold text-white/86 transition hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="text-xs font-semibold tracking-widest text-white/74">
              CONTACT
            </p>

            <div className="mt-4 space-y-2.5 text-sm text-white/84">
              <p>
                <span className="font-semibold text-white">Location:</span> Midrand,
                Gauteng, South Africa
              </p>
              <p>
                <span className="font-semibold text-white">WhatsApp:</span>{" "}
                <a href="tel:0734921669" className="hover:text-white">
                  073 492 1669
                </a>{" "}
              </p>
              <p>
                <span className="font-semibold text-white">Email:</span>{" "}
                <a
                  href={`mailto:${siteConfig.supportEmail}`}
                  className="hover:text-white"
                >
                  {siteConfig.supportEmail}
                </a>
              </p>
            </div>

            <div className="vsp-panel-soft mt-6 rounded-2xl p-4">
              <p className="text-xs font-semibold tracking-widest text-white/78">
                REVIEWS
              </p>
              <p className="mt-2 text-sm text-white/84">
                See recent Google reviews and business profile updates.
              </p>
              <TrackedExternalLink
                href={siteConfig.gbpUrl}
                target="_blank"
                rel="noreferrer"
                eventName="view_google_reviews"
                payload={{ source: "footer_reviews" }}
                className="water-hover vsp-focus mt-3 inline-flex rounded-xl border border-white/26 bg-white px-4 py-2 text-xs font-semibold tracking-widest text-[rgb(var(--vsp-red))] hover:opacity-95"
              >
                VIEW GOOGLE REVIEWS
              </TrackedExternalLink>
            </div>
          </div>
        </div>

        <div className="grid items-center gap-2 py-4 text-xs leading-none text-white/74 md:grid-cols-3">
          <p className="md:justify-self-start">(c) {year} Varsity Starter Pack. All rights reserved.</p>
          <a
            href="https://milkcybercreatives.co.za/"
            target="_blank"
            rel="noreferrer"
            className="justify-self-start text-white/82 transition hover:text-white md:justify-self-center"
          >
            Designed and developed by Milk Cyber Creatives
          </a>
          <div className="flex gap-4 md:justify-self-end">
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
