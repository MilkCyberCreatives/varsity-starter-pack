"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";

const PRIMARY = "#c41a1a";

export default function ScrollToTop() {
  const [shouldRender, setShouldRender] = useState(false); // based on scroll position
  const [isScrolling, setIsScrolling] = useState(false); // user actively scrolling
  const scrollStopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // scroll progress (0 -> 1)
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 22 });

  useEffect(() => {
    const onScroll = () => {
      const beyondThreshold = window.scrollY > 420;

      // only allow button when user has scrolled enough
      setShouldRender(beyondThreshold);

      // hide while actively scrolling, show when scrolling stops
      if (beyondThreshold) {
        setIsScrolling(true);
        if (scrollStopTimer.current) clearTimeout(scrollStopTimer.current);
        scrollStopTimer.current = setTimeout(() => {
          setIsScrolling(false);
        }, 220);
      } else {
        setIsScrolling(false);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollStopTimer.current) clearTimeout(scrollStopTimer.current);
    };
  }, []);

  const onTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // ✅ Premium behavior:
  // render only if beyond threshold AND user is NOT currently scrolling
  const visible = shouldRender && !isScrolling;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={onTop}
          aria-label="scroll to top"
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.96 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-50"
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          {/* Button shell */}
          <motion.div
            className="relative grid h-12 w-12 place-items-center rounded-full"
            // idle-only bounce (now only visible when idle anyway)
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ y: -8, scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            style={{
              backgroundColor: PRIMARY,
              boxShadow: "0 18px 40px rgba(196,26,26,0.25)",
            }}
          >
            {/* progress ring */}
            <svg
              className="absolute inset-0 h-12 w-12 -rotate-90"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              {/* track */}
              <circle
                cx="24"
                cy="24"
                r="21"
                fill="none"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="3"
              />
              {/* progress */}
              <motion.circle
                cx="24"
                cy="24"
                r="21"
                fill="none"
                stroke="rgba(255,255,255,0.95)"
                strokeWidth="3"
                strokeLinecap="round"
                style={{ pathLength: progress }}
              />
            </svg>

            {/* glow pulse */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{ opacity: [0.12, 0.26, 0.12] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.40), rgba(255,255,255,0) 55%)",
              }}
              aria-hidden="true"
            />

            {/* arrow */}
            <motion.span
              className="relative text-white text-lg font-semibold"
              animate={{ y: [0, -1, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              ↑
            </motion.span>
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
