import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CATEGORY_SALES, ORDERS, PRODUCTS, REVENUE_SERIES } from "@/data/catalog";
import { compactInr, inr, dateFmt } from "@/lib/format";
import { Counter, Reveal } from "@/components/motion-kit";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Anusha's Elite Business Portal" },
      { name: "description", content: "Revenue, orders, customers and inventory at a glance." },
      { property: "og:title", content: "Dashboard — Anusha's Elite" },
      { property: "og:description", content: "Operations at a glance." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const revenue = REVENUE_SERIES.reduce((s, r) => s + r.revenue, 0);
  const lowStock = PRODUCTS.filter((p) => p.stock < 6);

  const kpis = [
    { label: "Revenue (7 mo)", value: revenue, prefix: "₹" },
    { label: "Orders", value: REVENUE_SERIES.reduce((s, r) => s + r.orders, 0) },
    { label: "Customers", value: 82 },
    { label: "Products live", value: PRODUCTS.length },
  ];

  return (
    <div className="space-y-8">
      <Reveal>
        <p className="eyebrow">Overview</p>
        <h1 className="mt-2 font-display text-3xl">Good evening, Anusha</h1>
      </Reveal>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="border border-border bg-card p-5 transition-shadow hover:shadow-[var(--shadow-soft)]"
          >
            <p className="eyebrow">{k.label}</p>
            <p className="mt-3 font-display text-3xl">
              <Counter value={k.value} prefix={k.prefix ?? ""} />
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Reveal className="border border-border bg-card p-5">
          <p className="eyebrow">Sales analytics</p>
          <div className="mt-5 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_SERIES}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.096 78)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.72 0.096 78)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.014 82)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis tickFormatter={(v) => compactInr(v as number)} tickLine={false} axisLine={false} fontSize={11} width={54} />
                <Tooltip formatter={(v) => inr(v as number)} contentStyle={{ borderRadius: 2, border: "1px solid oklch(0.9 0.014 82)" }} />
                <Area type="monotone" dataKey="revenue" stroke="oklch(0.72 0.096 78)" fill="url(#rev)" strokeWidth={2} animationDuration={1200} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="border border-border bg-card p-5">
          <p className="eyebrow">Category sales</p>
          <div className="mt-5 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CATEGORY_SALES} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={92} tickLine={false} axisLine={false} fontSize={11} />
                <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: 2 }} />
                <Bar dataKey="value" fill="oklch(0.72 0.096 78)" radius={[0, 2, 2, 0]} animationDuration={1100} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Reveal>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Reveal className="border border-border bg-card p-5">
          <p className="eyebrow">Recent orders</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[10px] tracking-[0.16em] text-muted-foreground">
                  <th className="py-2">ORDER</th><th>CUSTOMER</th><th>DATE</th><th>STATUS</th><th className="text-right">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {ORDERS.map((o, i) => (
                  <motion.tr key={o.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-b border-border/60 transition-colors hover:bg-secondary/60">
                    <td className="py-3">#{o.id}</td>
                    <td>{o.customer}</td>
                    <td className="text-muted-foreground">{dateFmt(o.date)}</td>
                    <td><span className="border border-gold/50 px-2 py-0.5 text-[10px] tracking-[0.12em] text-gold">{o.status}</span></td>
                    <td className="text-right">{inr(o.total)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="border border-border bg-card p-5">
          <p className="eyebrow">Low stock</p>
          <ul className="mt-4 space-y-3 text-sm">
            {lowStock.map((p) => (
              <li key={p.slug} className="flex items-center justify-between gap-3">
                <span className="min-w-0 truncate">{p.name}</span>
                <span className={p.stock === 0 ? "text-destructive" : "text-maroon"}>{p.stock}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </div>
  );
}
