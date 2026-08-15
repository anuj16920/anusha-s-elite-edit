import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { inr, dateFmt } from "@/lib/format";
import { useStore } from "@/lib/store";
import { ORDER_STAGES } from "@/data/catalog";
import { GoldDivider, Reveal } from "@/components/motion-kit";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/order/$id")({
  head: () => ({
    meta: [
      { title: "Order Confirmed — Anusha's Elite" },
      { name: "description", content: "Your order is confirmed. Track weaving, dispatch and delivery in one place." },
      { property: "og:title", content: "Order Confirmed — Anusha's Elite" },
      { property: "og:description", content: "Thank you for your order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderPage,
});

function OrderPage() {
  const { id } = Route.useParams();
  const { orders } = useStore();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="mx-auto max-w-md px-6 py-32 text-center">
        <h1 className="font-display text-3xl">We couldn&apos;t find order {id}.</h1>
        <Link to="/track" className="btn-shine mt-6 inline-block bg-charcoal px-8 py-4 text-[11px] tracking-[0.24em] text-ivory">TRACK ANOTHER ORDER</Link>
      </div>
    );
  }

  const current = ORDER_STAGES.indexOf(order.status as (typeof ORDER_STAGES)[number]);

  return (
    <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
      <div className="text-center">
        <motion.svg viewBox="0 0 52 52" className="mx-auto h-16 w-16 text-gold" fill="none">
          <motion.circle cx="26" cy="26" r="24" stroke="currentColor" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} />
          <motion.path d="M16 27l7 7 13-14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, delay: 0.6 }} />
        </motion.svg>
        <Reveal delay={0.4}>
          <h1 className="mt-6 font-display text-4xl">Order confirmed</h1>
          <GoldDivider className="mt-4" />
          <p className="mt-4 text-sm text-muted-foreground">
            Order <span className="text-foreground">#{order.id}</span> · Placed {dateFmt(order.date)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Estimated delivery in 4–6 working days</p>
        </Reveal>
      </div>

      <div className="mt-12 border border-border bg-card p-6">
        <p className="eyebrow">Items</p>
        <div className="mt-4 space-y-4">
          {order.items.map((it) => (
            <div key={it.name} className="flex items-center gap-4">
              <img src={it.image} alt="" className="h-20 w-14 object-cover" loading="lazy" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{it.name}</p>
                <p className="eyebrow mt-1">Qty {it.qty}</p>
              </div>
              <span className="text-sm">{inr(it.price * it.qty)}</span>
            </div>
          ))}
        </div>
        <div className="gold-rule my-5" />
        <div className="flex justify-between font-display text-xl"><span>Total paid</span><span>{inr(order.total)}</span></div>
        <p className="mt-4 text-sm text-muted-foreground">Shipping to {order.address}</p>
      </div>

      <div className="mt-10">
        <p className="eyebrow">Tracking</p>
        <ol className="mt-5 space-y-6">
          {ORDER_STAGES.map((stage, i) => (
            <motion.li
              key={stage}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 * i, duration: 0.5 }}
              className="relative flex items-center gap-4 pl-1"
            >
              <span className={cn("grid h-3 w-3 shrink-0 place-items-center rounded-full", i < current ? "bg-gold" : i === current ? "bg-gold pulse-gold" : "border border-border bg-background")} />
              <span className={cn("text-sm", i <= current ? "text-foreground" : "text-muted-foreground")}>{stage}</span>
              {i < ORDER_STAGES.length - 1 && <span className="absolute left-[7px] top-5 h-6 w-px bg-border" />}
            </motion.li>
          ))}
        </ol>
      </div>

      <div className="mt-12 flex flex-wrap justify-center gap-3">
        <Link to="/shop" className="btn-shine bg-charcoal px-8 py-4 text-[11px] tracking-[0.24em] text-ivory">CONTINUE SHOPPING</Link>
        <Link to="/account" className="border border-border px-8 py-4 text-[11px] tracking-[0.24em]">MY ORDERS</Link>
      </div>
    </div>
  );
}
