import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Reveal } from "@/components/motion-kit";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Anusha's Elite Business Portal" },
      { name: "description", content: "Store, shipping and role settings for Anusha's Elite." },
      { property: "og:title", content: "Settings — Anusha's Elite" },
      { property: "og:description", content: "Store and role configuration." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Page,
});

function Page() {
  const { settings, saveSettings, resetDemoData } = useStore();
  const [form, setForm] = useState(settings);
  useEffect(() => setForm(settings), [settings]);

  const field = "mt-2 w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-gold";

  return (
    <div className="space-y-6">
      <Reveal>
        <p className="eyebrow">Business portal</p>
        <h1 className="mt-2 font-display text-3xl">Settings</h1>
      </Reveal>
      <div className="grid gap-4 md:grid-cols-2">
        <Reveal className="border border-border bg-card p-5"><p className="eyebrow">Store name</p><input value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} className={field} /></Reveal>
        <Reveal className="border border-border bg-card p-5"><p className="eyebrow">Support email</p><input value={form.supportEmail} onChange={(e) => setForm({ ...form, supportEmail: e.target.value })} className={field} /></Reveal>
        <Reveal className="border border-border bg-card p-5"><p className="eyebrow">Support phone</p><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={field} /></Reveal>
        <Reveal className="border border-border bg-card p-5"><p className="eyebrow">Free shipping above (₹)</p><input type="number" value={form.freeShippingAbove} onChange={(e) => setForm({ ...form, freeShippingAbove: +e.target.value })} className={field} /></Reveal>
        <Reveal className="border border-border bg-card p-5"><p className="eyebrow">Shipping fee (₹)</p><input type="number" value={form.shippingFee} onChange={(e) => setForm({ ...form, shippingFee: +e.target.value })} className={field} /></Reveal>
      </div>
      <Reveal className="border border-border bg-card p-5">
        <p className="eyebrow">Roles</p>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>Anusha Reddy — Owner (full access)</li>
          <li>Ravi Kumar — Operations (orders, inventory)</li>
          <li>Sana Q. — Marketing (coupons, CMS)</li>
        </ul>
      </Reveal>
      <div className="flex flex-wrap gap-3">
        <button onClick={() => { saveSettings(form); toast.success("Settings saved"); }} className="btn-shine bg-charcoal px-7 py-3.5 text-[11px] tracking-[0.24em] text-ivory">SAVE CHANGES</button>
        <button onClick={() => { resetDemoData(); toast.success("Demo data restored"); }} className="border border-border px-7 py-3.5 text-[11px] tracking-[0.24em] text-muted-foreground">RESET DEMO DATA</button>
      </div>
    </div>
  );
}

