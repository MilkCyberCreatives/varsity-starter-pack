"use client";

export default function GlobalFloatingItems() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[3] overflow-hidden">
      <span
        className="vsp-floating-shape vsp-floating-shape--pill vsp-float-a absolute left-[-120px] top-[4%] h-[280px] w-[280px]"
        style={{ opacity: 0.2 }}
      />
      <span
        className="vsp-floating-shape vsp-floating-shape--soft vsp-float-b absolute right-[-130px] top-[14%] h-[230px] w-[360px]"
        style={{ opacity: 0.18 }}
      />
      <span
        className="vsp-floating-shape vsp-floating-shape--ring vsp-float-c absolute left-[6%] top-[34%] hidden h-[170px] w-[170px] lg:block"
        style={{ opacity: 0.18 }}
      />
      <span
        className="vsp-floating-shape vsp-floating-shape--soft vsp-float-d absolute right-[8%] top-[44%] hidden h-[210px] w-[290px] md:block"
        style={{ opacity: 0.15 }}
      />
      <span
        className="vsp-floating-shape vsp-floating-shape--pill vsp-float-a absolute left-[22%] bottom-[8%] hidden h-[190px] w-[190px] md:block"
        style={{ opacity: 0.16 }}
      />
      <span
        className="vsp-floating-shape vsp-floating-shape--ring vsp-float-b absolute right-[16%] bottom-[10%] h-[200px] w-[200px]"
        style={{ opacity: 0.16 }}
      />
      <span
        className="vsp-floating-shape vsp-floating-shape--soft vsp-float-c absolute left-[36%] top-[62%] hidden h-[200px] w-[320px] lg:block"
        style={{ opacity: 0.14 }}
      />
      <span
        className="vsp-floating-shape vsp-floating-shape--ring vsp-float-d absolute left-[58%] top-[24%] hidden h-[140px] w-[140px] md:block"
        style={{ opacity: 0.16 }}
      />
      <span
        className="vsp-floating-shape vsp-floating-shape--pill vsp-float-c absolute right-[-88px] bottom-[-56px] h-[220px] w-[220px]"
        style={{ opacity: 0.18 }}
      />
      <span
        className="vsp-floating-shape vsp-floating-shape--soft vsp-float-b absolute left-[-100px] bottom-[16%] h-[180px] w-[260px]"
        style={{ opacity: 0.14 }}
      />
    </div>
  );
}
