import { Link } from "@tanstack/react-router";
import { Heart, Eye, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";
import { useState } from "react";
import type { Product } from "@/data/catalog";
import { inr } from "@/lib/format";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { QuickView } from "./QuickView";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { toggleWishlist, wishlist, addToCart } = useStore();
  const [quick, setQuick] = useState(false);
  const wished = wishlist.includes(product.slug);
  const off = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <>
      <motion.article
        layout
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12, scale: 0.98 }}
        transition={{ duration: 0.55, delay: Math.min(index * 0.05, 0.4), ease: [0.16, 1, 0.3, 1] }}
        className="group relative"
      >
        <Link to="/product/$slug" params={{ slug: product.slug }} className="block">
          <div data-cursor="view" className="relative aspect-[3/4] overflow-hidden bg-secondary">
            <img
              src={product.images[0]}
              alt={product.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06] group-hover:opacity-0"
            />
            <img
              src={product.images[1]}
              alt=""
              loading="lazy"
              aria-hidden
              className="absolute inset-0 h-full w-full scale-[1.04] object-cover opacity-0 transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 group-hover:opacity-100"
            />

            {product.badge && (
              <span className="absolute left-3 top-3 border border-gold/60 bg-background/85 px-2.5 py-1 text-[10px] tracking-[0.22em] text-charcoal">
                {product.badge.toUpperCase()}
              </span>
            )}
            {product.stock === 0 && (
              <span className="absolute inset-x-0 bottom-0 bg-charcoal/85 py-2 text-center text-[10px] tracking-[0.28em] text-ivory">
                SOLD OUT
              </span>
            )}

            <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 max-md:opacity-100">
              <button
                type="button"
                aria-label="Add to wishlist"
                onClick={(e) => {
                  e.preventDefault();
                  const added = toggleWishlist(product.slug);
                  toast[added ? "success" : "message"](added ? "Added to your collection" : "Removed from your collection", {
                    description: product.name,
                  });
                }}
                className="grid h-9 w-9 place-items-center rounded-full border border-border bg-background/90 transition-transform duration-300 hover:scale-110 active:scale-90"
              >
                <Heart className={cn("h-4 w-4", wished ? "fill-maroon text-maroon" : "text-charcoal")} />
              </button>
              <button
                type="button"
                aria-label="Quick view"
                onClick={(e) => {
                  e.preventDefault();
                  setQuick(true);
                }}
                className="grid h-9 w-9 place-items-center rounded-full border border-border bg-background/90 transition-transform duration-300 hover:scale-110 active:scale-90"
              >
                <Eye className="h-4 w-4 text-charcoal" />
              </button>
            </div>

            <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100 max-md:hidden">
              <button
                type="button"
                disabled={product.stock === 0}
                onClick={(e) => {
                  e.preventDefault();
                  addToCart(product.slug);
                  window.dispatchEvent(new CustomEvent("ae:cart-added"));
                  toast.success("Added to cart", { description: product.name });
                }}
                className="btn-shine w-full bg-charcoal py-3 text-[11px] tracking-[0.24em] text-ivory transition-colors duration-300 hover:bg-maroon disabled:opacity-40"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <ShoppingBag className="h-3.5 w-3.5" /> ADD TO CART
                </span>
              </button>
            </div>
          </div>

          <div className="pt-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5">
            <p className="eyebrow">{product.fabric}</p>
            <h3 className="mt-1 font-display text-lg leading-snug">{product.name}</h3>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="text-sm">{inr(product.price)}</span>
              <span className="text-xs text-muted-foreground line-through">{inr(product.mrp)}</span>
              <span className="text-xs text-gold">{off}% off</span>
            </div>
          </div>
        </Link>
      </motion.article>
      <QuickView product={product} open={quick} onOpenChange={setQuick} />
    </>
  );
}
