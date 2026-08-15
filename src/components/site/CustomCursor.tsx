import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

export function CustomCursor() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<"default" | "link" | "view">("default");
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 450, damping: 34, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 450, damping: 34, mass: 0.4 });

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setEnabled(true);
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as HTMLElement | null;
      if (el?.closest("[data-cursor='view']")) setMode("view");
      else if (el?.closest("a,button,[role='button'],input,select,textarea")) setMode("link");
      else setMode("default");
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [reduced, x, y]);

  if (!enabled) return null;

  const size = mode === "view" ? 66 : mode === "link" ? 34 : 10;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden md:block"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="flex items-center justify-center rounded-full border border-gold text-[9px] tracking-[0.24em] text-charcoal"
        animate={{
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          backgroundColor: mode === "view" ? "oklch(0.982 0.006 85 / 0.85)" : "oklch(0.72 0.096 78 / 0.28)",
        }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
      >
        {mode === "view" ? "VIEW" : null}
      </motion.div>
    </motion.div>
  );
}
