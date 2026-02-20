"use client";

import { useEffect, useRef } from "react";

export default function CursorHalo() {
  const ringRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    document.body.classList.add("vsp-cursor-active");

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { x: pointer.x, y: pointer.y };
    const dotPos = { x: pointer.x, y: pointer.y };
    let raf = 0;

    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };

    const tick = () => {
      ringPos.x += (pointer.x - ringPos.x) * 0.14;
      ringPos.y += (pointer.y - ringPos.y) * 0.14;
      dotPos.x += (pointer.x - dotPos.x) * 0.34;
      dotPos.y += (pointer.y - dotPos.y) * 0.34;

      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
      dot.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0)`;

      raf = window.requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.cancelAnimationFrame(raf);
      document.body.classList.remove("vsp-cursor-active");
    };
  }, []);

  return (
    <>
      <div ref={ringRef} aria-hidden="true" className="vsp-cursor-ring" />
      <div ref={dotRef} aria-hidden="true" className="vsp-cursor-dot" />
    </>
  );
}
