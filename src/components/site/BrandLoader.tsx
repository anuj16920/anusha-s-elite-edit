import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

export function BrandLoader() {
  const reduced = useReducedMotion();
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("ae_intro")) {
      setShow(false);
      return;
    }
    const t = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem("ae_intro", "1");
    }, reduced ? 200 : 1500);
    return () => clearTimeout(t);
  }, [reduced]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[120] grid place-items-center bg-ivory"
          exit={{ opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="text-center">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-2xl tracking-[0.36em] sm:text-3xl"
            >
              ANUSHA&apos;S ELITE
            </motion.p>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="gold-rule mx-auto mt-4 w-48 origin-left"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
