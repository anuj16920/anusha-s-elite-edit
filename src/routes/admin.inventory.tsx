import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { CUSTOMERS, COUPONS, ORDERS, PRODUCTS, REVIEWS } from "@/data/catalog";
import { inr, dateFmt } from "@/lib/format";
import { Reveal } from "@/components/motion-kit";

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
  void CUSTOMERS; void COUPONS; void ORDERS; void PRODUCTS; void REVIEWS; void inr; void dateFmt;
  const rows = PRODUCTS.map(p => ({ a:p.id, b:p.name, c:p.category, d:p.stock===0?'Out of stock':p.stock<6?'Low':'Healthy', e:String(p.stock) }));
  const heads = ['SKU', 'PRODUCT', 'CATEGORY', 'STATE', 'UNITS'];

  return (
    <div className="space-y-6">
      <Reveal>
        <p className="eyebrow">Business portal</p>
        <h1 className="mt-2 font-display text-3xl">Inventory</h1>
      </Reveal>
      <Reveal delay={0.05} className="border border-border bg-card p-5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[10px] tracking-[0.16em] text-muted-foreground">
                {heads.map((h) => (<th key={h} className="py-2 pr-4">{h}</th>))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <motion.tr key={r.a + i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="border-b border-border/60 transition-colors hover:bg-secondary/60">
                  <td className="py-3 pr-4">{r.a}</td>
                  <td className="pr-4 text-muted-foreground">{r.b}</td>
                  <td className="pr-4 text-muted-foreground">{r.c}</td>
                  <td className="pr-4"><span className="border border-gold/50 px-2 py-0.5 text-[10px] tracking-[0.12em] text-gold">{r.d}</span></td>
                  <td className="pr-4">{r.e}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </div>
  );
}
