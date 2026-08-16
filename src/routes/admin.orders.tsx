import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { ORDER_STAGES, type OrderStatus } from "@/data/catalog";
import { inr, dateFmt } from "@/lib/format";
import { Reveal } from "@/components/motion-kit";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/orders")({
  head: () => ({
    meta: [
      { title: "Orders — Anusha's Elite Business Portal" },
      { name: "description", content: "Manage orders for Anusha's Elite." },
      { property: "og:title", content: "Orders — Anusha's Elite" },
      { property: "og:description", content: "Manage orders." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Page,
});

const STATUSES: OrderStatus[] = [...ORDER_STAGES, "Cancelled"];

function Page() {
  const { orders, setOrderStatus } = useStore();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState<string | null>(null);

  const rows = orders.filter(
    (o) =>
      (filter === "All" || o.status === filter) &&
      (o.id + o.customer + o.email).toLowerCase().includes(q.trim().toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <Reveal>
        <p className="eyebrow">Business portal</p>
        <h1 className="mt-2 font-display text-3xl">Orders</h1>
      </Reveal>

      <div className="flex flex-wrap gap-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search order or customer" className="w-full max-w-xs border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold" />
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold">
          {["All", ...STATUSES].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <Reveal delay={0.05} className="border border-border bg-card p-5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[10px] tracking-[0.16em] text-muted-foreground">
                {["ORDER", "CUSTOMER", "DATE", "STATUS", "TOTAL", ""].map((h) => (<th key={h} className="py-2 pr-4">{h}</th>))}
              </tr>
            </thead>
            <tbody>
              {rows.map((o, i) => (
                <motion.tr key={o.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="border-b border-border/60 align-top transition-colors hover:bg-secondary/60">
                  <td className="py-3 pr-4">#{o.id}</td>
                  <td className="pr-4 text-muted-foreground">{o.customer}</td>
                  <td className="pr-4 text-muted-foreground">{dateFmt(o.date)}</td>
                  <td className="pr-4">
                    <select
                      value={o.status}
                      onChange={(e) => { setOrderStatus(o.id, e.target.value as OrderStatus); toast.success(`#${o.id} → ${e.target.value}`); }}
                      className="border border-gold/50 bg-transparent px-2 py-1 text-[10px] tracking-[0.12em] text-gold outline-none"
                    >
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="pr-4">{inr(o.total)}</td>
                  <td className="pr-4">
                    <button onClick={() => setOpen(open === o.id ? null : o.id)} className="link-underline text-[10px] tracking-[0.16em] text-muted-foreground">
                      {open === o.id ? "HIDE" : "VIEW"}
                    </button>
                    {open === o.id && (
                      <div className="mt-2 max-w-xs space-y-1 border border-border bg-secondary/40 p-3 text-[11px] text-muted-foreground">
                        <p>{o.email}</p>
                        <p>{o.address}</p>
                        {o.items.map((it) => <p key={it.name}>{it.qty} × {it.name} — {inr(it.price)}</p>)}
                        <p className="text-foreground">Payment: {o.payment}</p>
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {!rows.length && <p className="py-8 text-center text-sm text-muted-foreground">No orders match.</p>}
        </div>
      </Reveal>
    </div>
  );
}
