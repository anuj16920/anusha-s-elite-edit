import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { toast } from "sonner";
import { RETURNS } from "@/data/catalog";
import { inr, dateFmt } from "@/lib/format";
import { useStore } from "@/lib/store";
import { GoldDivider, Reveal } from "@/components/motion-kit";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account — Anusha's Elite" },
      { name: "description", content: "Your orders, addresses, reviews, returns and notifications in one place." },
      { property: "og:title", content: "My Account — Anusha's Elite" },
      { property: "og:description", content: "Manage your Anusha's Elite account." },
    ],
  }),
  component: Account,
});

function Account() {
  const { user, orders: allOrders, reviews, signOut } = useStore();
  const orders = allOrders;
  const myReviews = reviews.filter((r) => r.customer === user?.name);

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-6 py-32 text-center">
        <h1 className="font-display text-3xl">Sign in to view your account.</h1>
        <Link to="/auth" className="btn-shine mt-6 inline-block bg-charcoal px-8 py-4 text-[11px] tracking-[0.24em] text-ivory">SIGN IN</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-14 sm:px-8">
      <Reveal className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <p className="eyebrow">My account</p>
          <h1 className="mt-2 truncate font-display text-4xl">Namaste, {user.name.split(" ")[0]}</h1>
        </div>
        <button onClick={() => { signOut(); toast.message("Signed out"); }} className="shrink-0 border border-border px-5 py-3 text-[11px] tracking-[0.2em]">SIGN OUT</button>
      </Reveal>
      <GoldDivider className="mt-6" />

      <Tabs defaultValue="orders" className="mt-10">
        <TabsList className="flex w-full flex-wrap justify-start gap-1 bg-transparent p-0">
          {["orders", "addresses", "reviews", "returns", "notifications"].map((t) => (
            <TabsTrigger key={t} value={t} className="rounded-none border border-border px-4 py-2 text-[11px] tracking-[0.18em] data-[state=active]:border-gold data-[state=active]:text-gold">
              {t.toUpperCase()}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="orders" className="mt-8 space-y-4">
          {orders.map((o, i) => (
            <motion.div key={o.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border border-border bg-card p-5">
              <div className="min-w-0">
                <p className="text-sm">#{o.id} · {o.items.length} item(s)</p>
                <p className="eyebrow mt-1">{dateFmt(o.date)} · {o.status}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm">{inr(o.total)}</p>
                <Link to="/order/$id" params={{ id: o.id }} className="link-underline text-[10px] tracking-[0.18em] text-muted-foreground">TRACK</Link>
              </div>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="addresses" className="mt-8 grid gap-4 sm:grid-cols-2">
          {[["Home", "12 Rd No. 10, Banjara Hills, Hyderabad 500034"], ["Office", "WeWork Krishe Emerald, Kondapur, Hyderabad 500084"]].map(([label, addr]) => (
            <div key={label} className="border border-border bg-card p-5">
              <p className="eyebrow">{label}</p>
              <p className="mt-2 text-sm text-muted-foreground">{addr}</p>
              <button onClick={() => toast.message("Address editing is part of the demo flow")} className="link-underline mt-3 text-[10px] tracking-[0.18em]">EDIT</button>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="reviews" className="mt-8 space-y-4">
          {(myReviews.length ? myReviews : reviews.slice(0, 3)).map((r) => (
            <div key={r.product + r.date} className="border border-border bg-card p-5">
              <p className="text-sm">{r.product}</p>
              <p className="mt-2 text-sm text-muted-foreground">“{r.text}”</p>
              <p className="eyebrow mt-3">{dateFmt(r.date)} · {r.rating}/5</p>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="returns" className="mt-8 space-y-4">
          {RETURNS.map((r) => (
            <div key={r.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 border border-border bg-card p-5">
              <div className="min-w-0">
                <p className="text-sm">{r.id} · Order #{r.order}</p>
                <p className="eyebrow mt-1">{r.reason}</p>
              </div>
              <span className="shrink-0 text-sm text-gold">{r.status}</span>
            </div>
          ))}
          <button onClick={() => toast.success("Return request started", { description: "Our team will email you a pickup slot." })} className="btn-shine bg-charcoal px-6 py-3 text-[11px] tracking-[0.22em] text-ivory">
            REQUEST A RETURN
          </button>
        </TabsContent>

        <TabsContent value="notifications" className="mt-8 space-y-3">
          {["Your order #AE1022 has shipped.", "Festive Gold drops this Friday.", "Your review on Bridal Red Kanjeevaram is live."].map((n, i) => (
            <motion.div key={n} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="border-l-2 border-gold bg-card px-5 py-4 text-sm">
              {n}
            </motion.div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
