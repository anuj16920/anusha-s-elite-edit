import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Reveal } from "@/components/motion-kit";

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
  return (
    <div className="space-y-6">
      <Reveal>
        <p className="eyebrow">Business portal</p>
        <h1 className="mt-2 font-display text-3xl">Settings</h1>
      </Reveal>
      <div className="grid gap-4 md:grid-cols-2">
        {[
          ["Store name", "Anusha's Elite"],
          ["Support email", "care@anushaselite.com"],
          ["Free shipping threshold", "₹5,000"],
          ["Return window", "7 days"],
        ].map(([label, value]) => (
          <Reveal key={label} className="border border-border bg-card p-5">
            <p className="eyebrow">{label}</p>
            <input defaultValue={value} className="mt-2 w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-gold" />
          </Reveal>
        ))}
      </div>
      <Reveal className="border border-border bg-card p-5">
        <p className="eyebrow">Roles</p>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>Anusha Reddy — Owner (full access)</li>
          <li>Ravi Kumar — Operations (orders, inventory)</li>
          <li>Sana Q. — Marketing (coupons, CMS)</li>
        </ul>
      </Reveal>
      <button onClick={() => toast.success("Settings saved")} className="btn-shine bg-charcoal px-7 py-3.5 text-[11px] tracking-[0.24em] text-ivory">SAVE CHANGES</button>
    </div>
  );
}
