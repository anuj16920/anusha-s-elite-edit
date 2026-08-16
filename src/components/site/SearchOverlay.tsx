import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CATEGORIES } from "@/data/catalog";
import { inr } from "@/lib/format";
import { useStore } from "@/lib/store";

const TRENDING = ["Kanjeevaram", "Bridal red", "Organza", "Banarasi", "Under ₹10,000"];

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const { products } = useStore();

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) {
      document.addEventListener("keydown", esc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return products.filter((p) =>
      [p.name, p.category, p.fabric, p.colour, p.occasion].join(" ").toLowerCase().includes(term),
    ).slice(0, 6);
  }, [q, products]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 bg-charcoal/30 backdrop-blur-md" onClick={onClose} />
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto max-h-[88vh] w-full overflow-y-auto bg-background px-5 pb-10 pt-7 sm:px-10"
          >
            <div className="mx-auto max-w-4xl">
              <div className="flex items-center gap-4 border-b border-border pb-4">
                <Search className="h-5 w-5 text-gold" />
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search sarees, fabrics, occasions…"
                  className="w-full bg-transparent font-display text-2xl font-light outline-none placeholder:text-muted-foreground sm:text-3xl"
                />
                <button onClick={onClose} aria-label="Close search" className="p-2">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {!q && (
                <div className="mt-8 grid gap-8 sm:grid-cols-2">
                  <div>
                    <p className="eyebrow">Trending this week</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {TRENDING.map((t) => (
                        <button
                          key={t}
                          onClick={() => setQ(t.replace("Under ₹10,000", "linen"))}
                          className="border border-border px-3 py-1.5 text-xs transition-colors hover:border-gold hover:text-gold"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="eyebrow">Browse categories</p>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      {CATEGORIES.map((c) => (
                        <Link key={c.slug} to="/shop" search={{ category: c.name }} onClick={onClose} className="link-underline w-fit">
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 space-y-1">
                <AnimatePresence mode="popLayout">
                  {results.map((p, i) => (
                    <motion.div
                      key={p.slug}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35, delay: i * 0.04 }}
                    >
                      <Link
                        to="/product/$slug"
                        params={{ slug: p.slug }}
                        onClick={onClose}
                        className="flex items-center gap-4 border-b border-border/60 py-3 transition-colors hover:bg-secondary/50"
                      >
                        <img src={p.images[0]} alt="" className="h-16 w-12 object-cover" loading="lazy" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-display text-lg">{p.name}</p>
                          <p className="eyebrow">{p.category}</p>
                        </div>
                        <span className="text-sm">{inr(p.price)}</span>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {q && results.length === 0 && (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    Nothing matched “{q}”. Try “silk”, “bridal” or “organza”.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
