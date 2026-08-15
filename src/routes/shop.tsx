import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { z } from "zod";
import { CATEGORIES, COLLECTIONS, PRODUCTS } from "@/data/catalog";
import { ProductCard } from "@/components/site/ProductCard";
import { Counter, GoldDivider, Reveal } from "@/components/motion-kit";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  category: z.string().optional(),
  collection: z.string().optional(),
  sort: z.enum(["new", "price-asc", "price-desc", "rating"]).optional(),
  max: z.number().optional(),
});

export const Route = createFileRoute("/shop")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Shop All Sarees — Anusha's Elite" },
      { name: "description", content: "Browse handwoven Kanjeevaram, Banarasi, organza, tissue and handloom sarees. Filter by fabric, occasion and price." },
      { property: "og:title", content: "Shop All Sarees — Anusha's Elite" },
      { property: "og:description", content: "Handwoven luxury sarees, filtered your way." },
    ],
  }),
  component: Shop,
});

const SORTS = [
  ["new", "Newest"],
  ["price-asc", "Price: Low to High"],
  ["price-desc", "Price: High to Low"],
  ["rating", "Top Rated"],
] as const;

function Shop() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const [filtersOpen, setFiltersOpen] = useState(false);

  const products = useMemo(() => {
    let list = [...PRODUCTS];
    if (search.category) list = list.filter((p) => p.category === search.category);
    if (search.collection) list = list.filter((p) => p.collection === search.collection);
    if (search.max) list = list.filter((p) => p.price <= search.max!);
    switch (search.sort) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
      default: list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    }
    return list;
  }, [search]);

  const setParam = (patch: Record<string, unknown>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }) as never });

  const chips = [
    search.category && { label: search.category, clear: { category: undefined } },
    search.collection && { label: search.collection, clear: { collection: undefined } },
    search.max && { label: `Under ₹${search.max.toLocaleString("en-IN")}`, clear: { max: undefined } },
  ].filter(Boolean) as { label: string; clear: Record<string, unknown> }[];

  const Filters = (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Category</p>
        <div className="mt-3 space-y-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.slug}
              onClick={() => setParam({ category: search.category === c.name ? undefined : c.name })}
              className={cn("block text-sm transition-colors", search.category === c.name ? "text-gold" : "text-muted-foreground hover:text-foreground")}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="eyebrow">Collection</p>
        <div className="mt-3 space-y-2">
          {COLLECTIONS.map((c) => (
            <button
              key={c.slug}
              onClick={() => setParam({ collection: search.collection === c.name ? undefined : c.name })}
              className={cn("block text-sm transition-colors", search.collection === c.name ? "text-gold" : "text-muted-foreground hover:text-foreground")}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="eyebrow">Price</p>
        <div className="mt-3 space-y-2">
          {[10000, 20000, 30000, 50000].map((m) => (
            <button
              key={m}
              onClick={() => setParam({ max: search.max === m ? undefined : m })}
              className={cn("block text-sm transition-colors", search.max === m ? "text-gold" : "text-muted-foreground hover:text-foreground")}
            >
              Under ₹{m.toLocaleString("en-IN")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8">
      <Reveal className="text-center">
        <p className="eyebrow">The Collection</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">All sarees</h1>
        <GoldDivider className="mt-5" />
      </Reveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="hidden lg:block">{Filters}</aside>

        <div>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border pb-4 sm:flex sm:justify-between">
            <p className="min-w-0 truncate text-sm text-muted-foreground">
              <Counter value={products.length} duration={0.6} /> products
            </p>
            <div className="flex shrink-0 items-center gap-3">
              <button onClick={() => setFiltersOpen(true)} className="flex items-center gap-2 border border-border px-3 py-2 text-[11px] tracking-[0.18em] lg:hidden">
                <SlidersHorizontal className="h-3.5 w-3.5" /> FILTERS
              </button>
              <select
                value={search.sort ?? "new"}
                onChange={(e) => setParam({ sort: e.target.value })}
                className="border border-border bg-background px-3 py-2 text-[11px] tracking-[0.14em] outline-none"
              >
                {SORTS.map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <AnimatePresence>
            {chips.length > 0 && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex flex-wrap gap-2 pt-4">
                {chips.map((c) => (
                  <motion.button
                    layout
                    key={c.label}
                    onClick={() => setParam(c.clear)}
                    className="flex items-center gap-2 border border-gold/60 px-3 py-1.5 text-[11px] tracking-[0.14em] text-gold"
                  >
                    {c.label} <X className="h-3 w-3" />
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div layout className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {products.map((p, i) => (
                <ProductCard key={p.slug} product={p} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>

          {products.length === 0 && (
            <div className="py-24 text-center">
              <p className="font-display text-2xl">Nothing matches those filters yet.</p>
              <button onClick={() => navigate({ search: {} as never })} className="mt-6 border border-border px-6 py-3 text-[11px] tracking-[0.2em]">
                CLEAR FILTERS
              </button>
              <div className="mt-10 grid grid-cols-2 gap-6 opacity-40 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-[3/4] w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {filtersOpen && (
          <motion.div className="fixed inset-0 z-[88] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm" onClick={() => setFiltersOpen(false)} />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-background p-6"
            >
              <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-border" />
              {Filters}
              <button onClick={() => setFiltersOpen(false)} className="mt-8 w-full bg-charcoal py-4 text-[11px] tracking-[0.24em] text-ivory">
                SHOW {products.length} PRODUCTS
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
