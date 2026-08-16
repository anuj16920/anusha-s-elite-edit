import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { inr, dateFmt } from "@/lib/format";
import { Reveal } from "@/components/motion-kit";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/customers")({
  head: () => ({
    meta: [
      { title: "Customers — Anusha's Elite Business Portal" },
      { name: "description", content: "Customer directory for Anusha's Elite." },
      { property: "og:title", content: "Customers — Anusha's Elite" },
      { property: "og:description", content: "Customer directory." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Page,
});

function Page() {
  const { orders, messages, markMessageRead } = useStore();
  const [q, setQ] = useState("");

  const map = new Map<string, { name: string; email: string; orders: number; spend: number; last: string }>();
  for (const o of orders) {
    const cur = map.get(o.email) ?? { name: o.customer, email: o.email, orders: 0, spend: 0, last: o.date };
    cur.orders += 1;
    cur.spend += o.total;
    if (o.date > cur.last) cur.last = o.date;
    map.set(o.email, cur);
  }
  const rows = [...map.values()]
    .sort((a, b) => b.spend - a.spend)
    .filter((c) => (c.name + c.email).toLowerCase().includes(q.trim().toLowerCase()));

  return (
    <div className="space-y-6">
      <Reveal>
        <p className="eyebrow">Business portal</p>
        <h1 className="mt-2 font-display text-3xl">Customers</h1>
      </Reveal>

      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search customers" className="w-full max-w-xs border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold" />

      <Reveal delay={0.05} className="border border-border bg-card p-5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[10px] tracking-[0.16em] text-muted-foreground">
                {["CUSTOMER", "EMAIL", "ORDERS", "TIER", "LIFETIME SPEND"].map((h) => (<th key={h} className="py-2 pr-4">{h}</th>))}
              </tr>
            </thead>
            <tbody>
              {rows.map((c, i) => (
                <motion.tr key={c.email} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="border-b border-border/60 transition-colors hover:bg-secondary/60">
                  <td className="py-3 pr-4">{c.name}</td>
                  <td className="pr-4 text-muted-foreground">{c.email}</td>
                  <td className="pr-4 text-muted-foreground">{c.orders}</td>
                  <td className="pr-4"><span className="border border-gold/50 px-2 py-0.5 text-[10px] tracking-[0.12em] text-gold">{c.spend > 100000 ? "Elite" : c.spend > 40000 ? "Gold" : "Silver"}</span></td>
                  <td className="pr-4">{inr(c.spend)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      <Reveal delay={0.1} className="border border-border bg-card p-5">
        <h2 className="font-display text-xl">Enquiries</h2>
        <div className="mt-4 space-y-3">
          {messages.map((m) => (
            <div key={m.id} className="border border-border/70 p-4">
              <p className="text-sm">{m.subject || "Message"} — <span className="text-muted-foreground">{m.name} ({m.email})</span></p>
              <p className="mt-1 text-sm text-muted-foreground">{m.text}</p>
              <p className="mt-2 text-[10px] tracking-[0.16em] text-muted-foreground">
                {dateFmt(m.date)} • {m.read ? "READ" : <button className="link-underline text-gold" onClick={() => markMessageRead(m.id)}>MARK READ</button>}
              </p>
            </div>
          ))}
          {!messages.length && <p className="text-sm text-muted-foreground">No enquiries yet — messages from the contact page land here.</p>}
        </div>
      </Reveal>
    </div>
  );
}
