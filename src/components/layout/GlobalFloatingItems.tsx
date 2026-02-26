"use client";

import { useEffect, useState } from "react";

export default function GlobalFloatingItems() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 4);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className={[
        "pointer-events-none fixed inset-0 z-[3] h-screen overflow-hidden transition-opacity duration-500",
        visible ? "opacity-100" : "opacity-0",
      ].join(" ")}
    >
      <span
        className="vsp-floating-shape vsp-floating-shape--pill vsp-float-a absolute left-[-120px] top-[4%] h-[280px] w-[280px]"
        style={{ opacity: 0.42 }}
      />
      <span
        className="vsp-floating-shape vsp-floating-shape--soft vsp-float-b absolute right-[-130px] top-[12%] h-[230px] w-[360px]"
        style={{ opacity: 0.4 }}
      />
      <span
        className="vsp-floating-shape vsp-floating-shape--soft vsp-float-c absolute left-1/2 top-[8%] hidden h-[180px] w-[560px] -translate-x-1/2 lg:block"
        style={{ opacity: 0.24 }}
      />
      <span
        className="vsp-floating-shape vsp-floating-shape--ring vsp-float-c absolute left-[6%] top-[24%] hidden h-[170px] w-[170px] lg:block"
        style={{ opacity: 0.44 }}
      />
      <span
        className="vsp-floating-shape vsp-floating-shape--soft vsp-float-d absolute right-[8%] top-[28%] hidden h-[210px] w-[290px] md:block"
        style={{ opacity: 0.34 }}
      />
      <span
        className="vsp-floating-shape vsp-floating-shape--pill vsp-float-a absolute left-[22%] top-[36%] hidden h-[190px] w-[190px] md:block"
        style={{ opacity: 0.36 }}
      />
      <span
        className="vsp-floating-shape vsp-floating-shape--ring vsp-float-b absolute right-[16%] top-[40%] h-[190px] w-[190px]"
        style={{ opacity: 0.42 }}
      />
      <span
        className="vsp-floating-shape vsp-floating-shape--soft vsp-float-c absolute left-[36%] top-[44%] hidden h-[190px] w-[300px] lg:block"
        style={{ opacity: 0.32 }}
      />
      <span
        className="vsp-floating-shape vsp-floating-shape--ring vsp-float-d absolute left-[58%] top-[18%] hidden h-[140px] w-[140px] md:block"
        style={{ opacity: 0.36 }}
      />
      <span
        className="vsp-floating-shape vsp-floating-shape--pill vsp-float-b absolute left-1/2 top-[62%] hidden h-[160px] w-[460px] -translate-x-1/2 lg:block"
        style={{ opacity: 0.22 }}
      />
      <span
        className="vsp-floating-shape vsp-floating-shape--soft vsp-float-a absolute right-[-110px] top-[72%] hidden h-[260px] w-[340px] md:block"
        style={{ opacity: 0.28 }}
      />
      <span
        className="vsp-floating-shape vsp-floating-shape--ring vsp-float-d absolute left-[-80px] top-[76%] hidden h-[200px] w-[200px] md:block"
        style={{ opacity: 0.3 }}
      />
    </div>
  );
}
