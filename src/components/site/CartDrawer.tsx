import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useEffect } from "react";
import { inr } from "@/lib/format";
import { useStore } from "@/lib/store";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cartProducts, setQty, removeFromCart, subtotal, discount, shipping, total } = useStore();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[85]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-charcoal/35 backdrop-blur-[2px]" onClick={onClose} />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background shadow-[var(--shadow-lift)]"
          >
            <header className="flex items-center justify-between border-b border-border px-5 py-4">
              <p className="eyebrow">Your bag ({cartProducts.length})</p>
              <button onClick={onClose} aria-label="Close cart" className="p-1">
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-5">
              {cartProducts.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <ShoppingBag className="h-8 w-8 text-gold" />
                  <p className="font-display text-xl">Your cart is waiting for something beautiful.</p>
                  <Link to="/shop" onClick={onClose} className="btn-shine bg-charcoal px-7 py-3 text-[11px] tracking-[0.24em] text-ivory">
                    CONTINUE SHOPPING
                  </Link>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {cartProducts.map(({ product, qty }) => (
                    <motion.div
                      key={product.slug}
                      layout
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="flex gap-4 overflow-hidden border-b border-border/70 py-4"
                    >
                      <img src={product.images[0]} alt="" className="h-28 w-20 shrink-0 object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-base leading-snug">{product.name}</p>
                        <p className="eyebrow mt-1">{product.fabric}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center border border-border">
                            <button className="p-1.5" onClick={() => setQty(product.slug, qty - 1)} aria-label="Decrease">
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-7 text-center text-xs">{qty}</span>
                            <button className="p-1.5" onClick={() => setQty(product.slug, qty + 1)} aria-label="Increase">
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <motion.span key={product.price * qty} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="text-sm">
                            {inr(product.price * qty)}
                          </motion.span>
                        </div>
                        <button onClick={() => removeFromCart(product.slug)} className="link-underline mt-2 text-[10px] tracking-[0.2em] text-muted-foreground">
                          REMOVE
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {cartProducts.length > 0 && (
              <footer className="space-y-3 border-t border-border px-5 py-5">
                <Row label="Subtotal" value={inr(subtotal)} />
                {discount > 0 && <Row label="Discount" value={"– " + inr(discount)} />}
                <Row label="Shipping" value={shipping === 0 ? "Complimentary" : inr(shipping)} />
                <div className="gold-rule" />
                <div className="flex items-center justify-between font-display text-xl">
                  <span>Total</span>
                  <motion.span key={total} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
                    {inr(total)}
                  </motion.span>
                </div>
                <Link
                  to="/checkout"
                  onClick={onClose}
                  className="btn-shine block bg-charcoal py-4 text-center text-[11px] tracking-[0.26em] text-ivory transition-colors hover:bg-maroon"
                >
                  PROCEED TO CHECKOUT
                </Link>
                <Link to="/cart" onClick={onClose} className="block text-center text-[11px] tracking-[0.2em] text-muted-foreground">
                  VIEW FULL BAG
                </Link>
              </footer>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm text-muted-foreground">
      <span>{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}
