import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { inr } from "@/lib/format";
import { useStore } from "@/lib/store";
import { GoldDivider, Reveal } from "@/components/motion-kit";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Bag — Anusha's Elite" },
      { name: "description", content: "Review your selected sarees, apply a coupon and continue to a secure checkout." },
      { property: "og:title", content: "Your Bag — Anusha's Elite" },
      { property: "og:description", content: "Review your selected sarees and check out securely." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { cartProducts, setQty, removeFromCart, subtotal, discount, shipping, total, applyCoupon, coupon, clearCoupon } = useStore();
  const [code, setCode] = useState("");

  if (cartProducts.length === 0) {
    return (
      <div className="mx-auto grid max-w-md place-items-center px-6 py-32 text-center">
        <ShoppingBag className="h-8 w-8 text-gold" />
        <h1 className="mt-6 font-display text-3xl">Your cart is waiting for something beautiful.</h1>
        <GoldDivider className="mt-4" />
        <Link to="/shop" className="btn-shine mt-6 bg-charcoal px-8 py-4 text-[11px] tracking-[0.24em] text-ivory">CONTINUE SHOPPING</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-14 sm:px-8">
      <Reveal>
        <p className="eyebrow">Shopping bag</p>
        <h1 className="mt-2 font-display text-4xl">Your bag</h1>
      </Reveal>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <AnimatePresence initial={false}>
            {cartProducts.map(({ product, qty }) => (
              <motion.div key={product.slug} layout exit={{ opacity: 0, x: -30 }} className="flex gap-5 border-b border-border py-6">
                <img src={product.images[0]} alt="" className="h-36 w-28 object-cover" loading="lazy" />
                <div className="min-w-0 flex-1">
                  <Link to="/product/$slug" params={{ slug: product.slug }} className="font-display text-xl">{product.name}</Link>
                  <p className="eyebrow mt-1">{product.fabric}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-4">
                    <div className="flex items-center border border-border">
                      <button className="p-2" onClick={() => setQty(product.slug, qty - 1)} aria-label="Decrease"><Minus className="h-3 w-3" /></button>
                      <span className="w-8 text-center text-sm">{qty}</span>
                      <button className="p-2" onClick={() => setQty(product.slug, qty + 1)} aria-label="Increase"><Plus className="h-3 w-3" /></button>
                    </div>
                    <button onClick={() => removeFromCart(product.slug)} className="link-underline text-[10px] tracking-[0.2em] text-muted-foreground">REMOVE</button>
                  </div>
                </div>
                <motion.span key={qty} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="text-sm">{inr(product.price * qty)}</motion.span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <aside className="h-fit border border-border bg-card p-6 lg:sticky lg:top-28">
          <p className="eyebrow">Order summary</p>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{inr(subtotal)}</span></div>
            {discount > 0 && <div className="flex justify-between text-gold"><span>Discount ({coupon})</span><span>– {inr(discount)}</span></div>}
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "Complimentary" : inr(shipping)}</span></div>
          </div>
          <div className="gold-rule my-5" />
          <div className="flex items-baseline justify-between font-display text-2xl">
            <span>Total</span>
            <motion.span key={total} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>{inr(total)}</motion.span>
          </div>

          <div className="mt-6 flex border border-border">
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Coupon code" className="w-full bg-transparent px-3 py-3 text-sm outline-none" />
            <button
              onClick={() => {
                const res = applyCoupon(code);
                toast[res.ok ? "success" : "error"](res.message);
                if (res.ok) setCode("");
              }}
              className="bg-charcoal px-4 text-[10px] tracking-[0.2em] text-ivory"
            >
              APPLY
            </button>
          </div>
          {coupon && (
            <button onClick={clearCoupon} className="mt-2 text-[10px] tracking-[0.18em] text-muted-foreground">REMOVE COUPON</button>
          )}
          <p className="mt-2 text-[11px] text-muted-foreground">Try ELITE10 or FESTIVE1500.</p>

          <Link to="/checkout" className="btn-shine mt-6 block bg-charcoal py-4 text-center text-[11px] tracking-[0.26em] text-ivory transition-colors hover:bg-maroon">
            PROCEED TO CHECKOUT
          </Link>
        </aside>
      </div>
    </div>
  );
}
