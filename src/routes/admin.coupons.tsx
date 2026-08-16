import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { inr } from "@/lib/format";
import { Reveal } from "@/components/motion-kit";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/coupons")({
  head: () => ({
    meta: [
      { title: "Coupons — Anusha's Elite Business Portal" },
      { name: "description", content: "Manage coupons for Anusha's Elite." },
      { property: "og:title", content: "Coupons — Anusha's Elite" },
      { property: "og:description", content: "Manage coupons." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Page,
});

function Page() {
  const { coupons, saveCoupon, toggleCouponStatus, deleteCoupon } = useStore();
  const [code, setCode] = useState("");
  const [type, setType] = useState<"percent" | "flat">("percent");
  const [val, setVal] = useState(10);
  const [min, setMin] = useState(5000);

  const field = "mt-1 w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold";

  return (
    <div className="space-y-6">
      <Reveal>
        <p className="eyebrow">Business portal</p>
        <h1 className="mt-2 font-display text-3xl">Coupons</h1>
      </Reveal>

      <form
        className="grid gap-4 border border-border bg-card p-5 sm:grid-cols-5"
        onSubmit={(e) => {
          e.preventDefault();
          const c = code.trim().toUpperCase();
          if (!c) { toast.error("Enter a code."); return; }
          saveCoupon({ code: c, type, value: Number(val), minimum: Number(min), uses: 0, status: "Active", expires: "2027-12-31" });
          toast.success(`${c} is live`);
          setCode("");
        }}
      >
        <label className="block sm:col-span-2"><span className="eyebrow">Code</span><input value={code} onChange={(e) => setCode(e.target.value)} placeholder="DIWALI25" className={field} /></label>
        <label className="block"><span className="eyebrow">Type</span>
          <select value={type} onChange={(e) => setType(e.target.value as "percent" | "flat")} className={field}><option value="percent">Percent</option><option value="flat">Flat</option></select>
        </label>
        <label className="block"><span className="eyebrow">Value</span><input type="number" value={val} onChange={(e) => setVal(+e.target.value)} className={field} /></label>
        <label className="block"><span className="eyebrow">Min order</span><input type="number" value={min} onChange={(e) => setMin(+e.target.value)} className={field} /></label>
        <div className="sm:col-span-5"><button className="btn-shine bg-charcoal px-6 py-3 text-[11px] tracking-[0.2em] text-ivory">CREATE COUPON</button></div>
      </form>

      <Reveal delay={0.05} className="border border-border bg-card p-5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[10px] tracking-[0.16em] text-muted-foreground">
                {["CODE", "VALUE", "CONDITION", "STATUS", "USAGE", ""].map((h) => (<th key={h} className="py-2 pr-4">{h}</th>))}
              </tr>
            </thead>
            <tbody>
              {coupons.map((c, i) => (
                <motion.tr key={c.code} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="border-b border-border/60 transition-colors hover:bg-secondary/60">
                  <td className="py-3 pr-4">{c.code}</td>
                  <td className="pr-4 text-muted-foreground">{c.type === "percent" ? c.value + "%" : inr(c.value)}</td>
                  <td className="pr-4 text-muted-foreground">Min {inr(c.minimum)}</td>
                  <td className="pr-4"><span className="border border-gold/50 px-2 py-0.5 text-[10px] tracking-[0.12em] text-gold">{c.status}</span></td>
                  <td className="pr-4">{c.uses} uses</td>
                  <td className="space-x-3 pr-4 text-[10px] tracking-[0.16em]">
                    <button className="link-underline text-muted-foreground" onClick={() => toggleCouponStatus(c.code)}>{c.status === "Active" ? "DISABLE" : "ACTIVATE"}</button>
                    <button className="link-underline text-maroon" onClick={() => { deleteCoupon(c.code); toast.success("Coupon deleted"); }}>DELETE</button>
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
