import Image from "next/image";
import Link from "next/link";

type Crumb = { label: string; href?: string };

type Props = {
  title: string;
  subtitle?: string;
  crumbs: Crumb[];
  imageSrc?: string;
};

export default function BreadcrumbHero({
  title,
  subtitle,
  crumbs,
  imageSrc = "/breadcrumb/breadcrumb.jpg",
}: Props) {
  return (
    <section className="relative w-full overflow-hidden bg-transparent" data-vsp-hero="1">
      <div className="relative h-[168px] w-full sm:h-[188px]">
        <Image
          src={imageSrc}
          alt="page banner"
          fill
          priority={false}
          className="object-cover"
          sizes="100vw"
        />

        <div className="absolute inset-0 bg-[rgb(var(--vsp-red-deep))]/62" />

        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(900px circle at 15% 20%, rgba(255,255,255,0.16), transparent 58%), radial-gradient(900px circle at 85% 20%, rgba(255,255,255,0.12), transparent 58%)",
          }}
        />
        <div className="absolute inset-0">
          <div className="mx-auto flex h-full max-w-6xl flex-col justify-center px-4">
            <nav className="flex flex-wrap items-center gap-2 text-[11px] font-semibold tracking-widest text-white/72">
              {crumbs.map((c, idx) => {
                const isLast = idx === crumbs.length - 1;

                return (
                  <span key={`${c.label}-${idx}`} className="flex items-center gap-2">
                    {c.href && !isLast ? (
                      <Link
                        href={c.href}
                        className="transition hover:text-white"
                      >
                        {c.label}
                      </Link>
                    ) : (
                      <span className={isLast ? "text-white/92" : ""}>
                        {c.label}
                      </span>
                    )}

                    {!isLast && <span className="text-white/45">/</span>}
                  </span>
                );
              })}
            </nav>

            <h1 className="mt-3 text-3xl font-medium tracking-tight text-white sm:text-4xl">
              {title}
            </h1>

            {subtitle ? (
              <p className="mt-2 max-w-2xl text-sm text-white/86">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-10"
          style={{
            background:
              "linear-gradient(180deg, rgba(120,10,10,0), rgba(120,10,10,0.12) 60%, rgba(176,20,20,0) 100%)",
          }}
        />
      </div>

    </section>
  );
}
