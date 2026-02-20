"use client";

export default function GlobalFloatingItems() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[3] overflow-hidden"
      style={{
        WebkitMaskImage:
          "linear-gradient(to bottom, black 0%, black 84%, transparent 100%)",
        maskImage:
          "linear-gradient(to bottom, black 0%, black 84%, transparent 100%)",
      }}
    >
      <span
        className="vsp-floating-shape vsp-floating-shape--pill vsp-float-a absolute left-[-120px] top-[4%] h-[280px] w-[280px]"
        style={{ opacity: 0.34 }}
      />
      <span
        className="vsp-floating-shape vsp-floating-shape--soft vsp-float-b absolute right-[-130px] top-[14%] h-[230px] w-[360px]"
        style={{ opacity: 0.32 }}
      />
      <span
        className="vsp-floating-shape vsp-floating-shape--ring vsp-float-c absolute left-[6%] top-[34%] hidden h-[170px] w-[170px] lg:block"
        style={{ opacity: 0.36 }}
      />
      <span
        className="vsp-floating-shape vsp-floating-shape--soft vsp-float-d absolute right-[8%] top-[44%] hidden h-[210px] w-[290px] md:block"
        style={{ opacity: 0.28 }}
      />
      <span
        className="vsp-floating-shape vsp-floating-shape--pill vsp-float-a absolute left-[22%] top-[68%] hidden h-[190px] w-[190px] md:block"
        style={{ opacity: 0.3 }}
      />
      <span
        className="vsp-floating-shape vsp-floating-shape--ring vsp-float-b absolute right-[16%] top-[58%] h-[190px] w-[190px]"
        style={{ opacity: 0.34 }}
      />
      <span
        className="vsp-floating-shape vsp-floating-shape--soft vsp-float-c absolute left-[36%] top-[56%] hidden h-[190px] w-[300px] lg:block"
        style={{ opacity: 0.26 }}
      />
      <span
        className="vsp-floating-shape vsp-floating-shape--ring vsp-float-d absolute left-[58%] top-[24%] hidden h-[140px] w-[140px] md:block"
        style={{ opacity: 0.3 }}
      />
    </div>
  );
}
