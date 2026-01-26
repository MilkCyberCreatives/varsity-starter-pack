import Image from "next/image";
import Link from "next/link";

type Crumb = { label: string; href?: string };

type Props = {
  title: string;
  subtitle?: string;
  crumbs: Crumb[];
  imageSrc?: string; // same image for all pages
};

export default function BreadcrumbHero({
  title,
  subtitle,
  crumbs,
  imageSrc = "/breadcrumb/breadcrumb.jpg",
}: Props) {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* Slim premium banner */}
      <div className="relative h-[150px] w-full sm:h-[170px]">
        <Image
          src={imageSrc}
          alt="page banner"
          fill
          priority={false}
          className="object-cover"
          sizes="100vw"
        />

        {/* crisp overlay */}
        <div className="absolute inset-0 bg-white/70" />

        {/* subtle brand wash */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(900px circle at 15% 20%, rgba(196,26,26,0.10), transparent 55%), radial-gradient(900px circle at 85% 20%, rgba(19,116,184,0.10), transparent 55%)",
          }}
        />

        {/* content */}
        <div className="absolute inset-0">
          <div className="mx-auto flex h-full max-w-6xl flex-col justify-center px-4">
            {/* breadcrumbs */}
            <nav className="flex flex-wrap items-center gap-2 text-[11px] font-semibold tracking-widest text-black/50">
              {crumbs.map((c, idx) => {
                const isLast = idx === crumbs.length - 1;

                return (
                  <span key={`${c.label}-${idx}`} className="flex items-center gap-2">
                    {c.href && !isLast ? (
                      <Link
                        href={c.href}
                        className="transition hover:text-black"
                      >
                        {c.label}
                      </Link>
                    ) : (
                      <span className={isLast ? "text-black/70" : ""}>
                        {c.label}
                      </span>
                    )}

                    {!isLast && <span className="text-black/30">/</span>}
                  </span>
                );
              })}
            </nav>

            {/* title */}
            <h1 className="mt-3 text-3xl font-medium tracking-tight text-black sm:text-4xl">
              {title}
            </h1>

            {subtitle ? (
              <p className="mt-2 max-w-2xl text-sm text-black/65">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {/* thin separator line (premium) */}
      <div className="h-px w-full bg-black/10" />
    </section>
  );
}
