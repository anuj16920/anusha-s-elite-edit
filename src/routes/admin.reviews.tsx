import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { dateFmt } from "@/lib/format";
import { Reveal } from "@/components/motion-kit";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/reviews")({
  head: () => ({
    meta: [
      { title: "Reviews — Anusha's Elite Business Portal" },
      { name: "description", content: "Moderate reviews for Anusha's Elite." },
      { property: "og:title", content: "Reviews — Anusha's Elite" },
      { property: "og:description", content: "Moderate reviews." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Page,
});

function Page() {
  const { reviews, setReviewStatus, deleteReview } = useStore();
  const [tab, setTab] = useState("All");
  const list = reviews.map((r, i) => ({ r, i })).filter(({ r }) => tab === "All" || r.status === tab);

  return (
    <div className="space-y-6">
      <Reveal>
        <p className="eyebrow">Business portal</p>
        <h1 className="mt-2 font-display text-3xl">Reviews</h1>
      </Reveal>

      <div className="flex gap-2">
        {["All", "Pending", "Published", "Rejected"].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`border px-3 py-1.5 text-[10px] tracking-[0.16em] ${tab === t ? "border-gold text-gold" : "border-border text-muted-foreground"}`}>{t.toUpperCase()}</button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {list.map(({ r, i }, n) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: n * 0.04 }} className="border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="font-display text-lg">{r.product}</p>
              <span className="text-gold">{"★".repeat(r.rating)}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{r.text}</p>
            <p className="mt-3 text-[11px] tracking-[0.14em] text-muted-foreground">{r.customer} • {dateFmt(r.date)} • {r.status}</p>
            <div className="mt-4 space-x-4 text-[10px] tracking-[0.16em]">
              <button className="link-underline text-gold" onClick={() => { setReviewStatus(i, "Published"); toast.success("Review published"); }}>PUBLISH</button>
              <button className="link-underline text-muted-foreground" onClick={() => setReviewStatus(i, "Rejected")}>REJECT</button>
              <button className="link-underline text-maroon" onClick={() => { deleteReview(i); toast.success("Review deleted"); }}>DELETE</button>
            </div>
          </motion.div>
        ))}
        {!list.length && <p className="text-sm text-muted-foreground">Nothing here yet.</p>}
      </div>
    </div>
  );
}
