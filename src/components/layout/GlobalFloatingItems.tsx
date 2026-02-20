"use client";

export default function GlobalFloatingItems() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[3] overflow-hidden">
      <span
        className="vsp-floating-shape vsp-floating-shape--pill vsp-float-a absolute left-[-120px] top-[4%] h-[280px] w-[280px]"
        style={{ opacity: 0.14 }}
      />
      <span
        className="vsp-floating-shape vsp-floating-shape--pill vsp-float-b absolute right-[-88px] top-[14%] h-[210px] w-[210px]"
        style={{ opacity: 0.12 }}
      />
      <span
        className="vsp-floating-shape vsp-floating-shape--ring vsp-float-c absolute left-[6%] top-[34%] hidden h-[170px] w-[170px] lg:block"
        style={{ opacity: 0.1 }}
      />
      <span
        className="vsp-floating-shape vsp-floating-shape--pill vsp-float-d absolute right-[10%] top-[46%] hidden h-[150px] w-[150px] md:block"
        style={{ opacity: 0.1 }}
      />
      <span
        className="vsp-floating-shape vsp-floating-shape--pill vsp-float-a absolute left-[22%] bottom-[8%] hidden h-[190px] w-[190px] md:block"
        style={{ opacity: 0.1 }}
      />
      <span
        className="vsp-floating-shape vsp-floating-shape--ring vsp-float-b absolute right-[16%] bottom-[10%] h-[200px] w-[200px]"
        style={{ opacity: 0.12 }}
      />
    </div>
  );
}
