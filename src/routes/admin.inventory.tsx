import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { Reveal } from "@/components/motion-kit";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/inventory")({
  head: () => ({
    meta: [
      { title: "Inventory — Anusha's Elite Business Portal" },
      { name: "description", content: "Manage inventory for Anusha's Elite." },
      { property: "og:title", content: "Inventory — Anusha's Elite" },
      { property: "og:description", content: "Manage inventory." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Page,
});

function Page() {
  const { products, setStock } = useStore();
  const [lowOnly, setLowOnly] = useState(false);
  const rows = products.filter((p) => (lowOnly ? p.stock < 6 : true));

  return (
    <div className="space-y-6">
      <Reveal>
        <p className="eyebrow">Business portal</p>
        <h1 className="mt-2 font-display text-3xl">Inventory</h1>
      </Reveal>

      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input type="checkbox" checked={lowOnly} onChange={(e) => setLowOnly(e.target.checked)} className="accent-[var(--gold,#b8860b)]" />
        Show low & out of stock only
      </label>

      <Reveal delay={0.05} className="border border-border bg-card p-5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[10px] tracking-[0.16em] text-muted-foreground">
                {["SKU", "PRODUCT", "CATEGORY", "STATE", "UNITS"].map((h) => (<th key={h} className="py-2 pr-4">{h}</th>))}
              </tr>
            </thead>
            <tbody>
              {rows.map((p, i) => (
                <motion.tr key={p.slug} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="border-b border-border/60 transition-colors hover:bg-secondary/60">
                  <td className="py-3 pr-4">{p.id}</td>
                  <td className="pr-4 text-muted-foreground">{p.name}</td>
                  <td className="pr-4 text-muted-foreground">{p.category}</td>
                  <td className="pr-4"><span className="border border-gold/50 px-2 py-0.5 text-[10px] tracking-[0.12em] text-gold">{p.stock === 0 ? "Out of stock" : p.stock < 6 ? "Low" : "Healthy"}</span></td>
                  <td className="pr-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setStock(p.slug, p.stock - 1)} className="border border-border px-2 leading-6">−</button>
                      <input type="number" value={p.stock} onChange={(e) => setStock(p.slug, +e.target.value)} className="w-16 border border-border bg-background px-2 py-1 text-sm outline-none focus:border-gold" />
                      <button onClick={() => setStock(p.slug, p.stock + 1)} className="border border-border px-2 leading-6">+</button>
                      <button onClick={() => { setStock(p.slug, p.stock + 10); toast.success(`Restocked ${p.name}`); }} className="link-underline text-[10px] tracking-[0.16em] text-muted-foreground">+10</button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </div>
  );
}
