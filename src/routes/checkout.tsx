import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { useState } from "react";
import { inr } from "@/lib/format";
import { useStore } from "@/lib/store";
import { Reveal } from "@/components/motion-kit";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Anusha's Elite" },
      { name: "description", content: "A guided, secure checkout for your handwoven saree order." },
      { property: "og:title", content: "Checkout — Anusha's Elite" },
      { property: "og:description", content: "Contact, address and payment in three calm steps." },
    ],
  }),
  component: Checkout,
});

const STEPS = ["Contact", "Address", "Payment"] as const;

function Checkout() {
  const { cartProducts, subtotal, discount, shipping, total, placeOrder } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", pin: "", method: "upi" });

  if (cartProducts.length === 0) {
    return (
      <div className="mx-auto max-w-md px-6 py-32 text-center">
        <h1 className="font-display text-3xl">Nothing to check out yet.</h1>
        <Link to="/shop" className="btn-shine mt-6 inline-block bg-charcoal px-8 py-4 text-[11px] tracking-[0.24em] text-ivory">EXPLORE SAREES</Link>
      </div>
    );
  }

  const field = (key: keyof typeof form, label: string, type = "text") => (
    <label className="block">
      <span className="eyebrow">{label}</span>
      <input
        type={type}
        required
        value={form[key] as string}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-gold"
      />
    </label>
  );

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-14 sm:px-8">
      <Reveal className="text-center">
        <h1 className="font-display text-4xl">Checkout</h1>
      </Reveal>

      <div className="mx-auto mt-10 flex max-w-lg items-center">
        {STEPS.map((s, i) => (
          <div key={s} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <motion.div
                animate={{
                  backgroundColor: i < step ? "oklch(0.72 0.096 78)" : i === step ? "oklch(0.245 0.008 60)" : "oklch(0.955 0.011 82)",
                  color: i <= step ? "oklch(0.99 0.005 85)" : "oklch(0.505 0.014 70)",
                }}
                className="grid h-9 w-9 place-items-center rounded-full text-xs"
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </motion.div>
              <span className="text-[10px] tracking-[0.16em] text-muted-foreground">{s.toUpperCase()}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="mx-2 h-px flex-1 bg-border">
                <motion.div className="h-px bg-gold" initial={{ scaleX: 0 }} animate={{ scaleX: i < step ? 1 : 0 }} style={{ originX: 0 }} transition={{ duration: 0.5 }} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (step < 2) return setStep(step + 1);
            const order = placeOrder({ name: form.name, email: form.email, address: `${form.address}, ${form.city} ${form.pin}` });
            navigate({ to: "/order/$id", params: { id: order.id } });
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-5"
            >
              {step === 0 && (
                <>
                  {field("name", "Full name")}
                  {field("email", "Email", "email")}
                  {field("phone", "Phone", "tel")}
                </>
              )}
              {step === 1 && (
                <>
                  {field("address", "Street address")}
                  <div className="grid grid-cols-2 gap-4">
                    {field("city", "City")}
                    {field("pin", "PIN code")}
                  </div>
                </>
              )}
              {step === 2 && (
                <div className="space-y-3">
                  {[["upi", "UPI — GPay, PhonePe, Paytm"], ["card", "Credit / Debit card"], ["cod", "Cash on delivery"]].map(([v, l]) => (
                    <label key={v} className={`flex cursor-pointer items-center gap-3 border px-4 py-4 text-sm transition-colors ${form.method === v ? "border-gold" : "border-border"}`}>
                      <input type="radio" name="method" value={v} checked={form.method === v} onChange={() => setForm((f) => ({ ...f, method: v! }))} className="accent-[oklch(0.72_0.096_78)]" />
                      {l}
                    </label>
                  ))}
                  <p className="text-[11px] text-muted-foreground">Demo payment — no real transaction is processed.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex gap-3">
            {step > 0 && (
              <button type="button" onClick={() => setStep(step - 1)} className="border border-border px-6 py-4 text-[11px] tracking-[0.22em]">BACK</button>
            )}
            <button type="submit" className="btn-shine flex-1 bg-charcoal py-4 text-[11px] tracking-[0.24em] text-ivory transition-colors hover:bg-maroon">
              {step === 2 ? `PAY ${inr(total)}` : "CONTINUE"}
            </button>
          </div>
        </form>

        <aside className="h-fit border border-border bg-card p-6">
          <p className="eyebrow">Order summary</p>
          <div className="mt-4 space-y-4">
            {cartProducts.map(({ product, qty }) => (
              <div key={product.slug} className="flex gap-3">
                <img src={product.images[0]} alt="" className="h-20 w-14 object-cover" loading="lazy" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{product.name}</p>
                  <p className="eyebrow mt-1">Qty {qty}</p>
                </div>
                <span className="text-sm">{inr(product.price * qty)}</span>
              </div>
            ))}
          </div>
          <div className="gold-rule my-5" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{inr(subtotal)}</span></div>
            {discount > 0 && <div className="flex justify-between text-gold"><span>Discount</span><span>– {inr(discount)}</span></div>}
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "Complimentary" : inr(shipping)}</span></div>
            <div className="flex justify-between pt-2 font-display text-xl"><span>Total</span><span>{inr(total)}</span></div>
          </div>
        </aside>
      </div>
    </div>
  );
}
