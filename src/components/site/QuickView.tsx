import { Link } from "@tanstack/react-router";
import { Heart, Minus, Plus, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { Product } from "@/data/catalog";
import { inr } from "@/lib/format";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function QuickView({
  product,
  open,
  onOpenChange,
}: {
  product: Product;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const [qty, setQty] = useState(1);
  const wished = wishlist.includes(product.slug);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl gap-0 overflow-hidden border-border bg-card p-0 sm:rounded-none">
        <div className="grid md:grid-cols-2">
          <img src={product.images[0]} alt={product.name} className="h-full max-h-[70vh] w-full object-cover" />
          <div className="p-6 sm:p-8">
            <p className="eyebrow">{product.category}</p>
            <DialogTitle className="mt-2 font-display text-2xl font-light">{product.name}</DialogTitle>
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={cn("h-3.5 w-3.5", i < Math.round(product.rating) && "fill-gold")} />
                ))}
              </span>
              {product.rating} · {product.reviews} reviews
            </div>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-xl">{inr(product.price)}</span>
              <span className="text-sm text-muted-foreground line-through">{inr(product.mrp)}</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center border border-border">
                <button className="p-2.5 transition-colors hover:bg-secondary" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-9 text-center text-sm">{qty}</span>
                <button className="p-2.5 transition-colors hover:bg-secondary" onClick={() => setQty((q) => q + 1)} aria-label="Increase">
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <button
                onClick={() => {
                  addToCart(product.slug, qty);
                  window.dispatchEvent(new CustomEvent("ae:cart-added"));
                  toast.success("Added to cart", { description: `${qty} × ${product.name}` });
                  onOpenChange(false);
                }}
                className="btn-shine flex-1 bg-charcoal py-3 text-[11px] tracking-[0.24em] text-ivory transition-colors hover:bg-maroon"
              >
                ADD TO CART
              </button>
              <button
                aria-label="Wishlist"
                onClick={() => {
                  const added = toggleWishlist(product.slug);
                  toast[added ? "success" : "message"](added ? "Added to your collection" : "Removed from your collection");
                }}
                className="grid h-11 w-11 place-items-center border border-border transition-transform hover:scale-105 active:scale-90"
              >
                <Heart className={cn("h-4 w-4", wished && "fill-maroon text-maroon")} />
              </button>
            </div>

            <Link
              to="/product/$slug"
              params={{ slug: product.slug }}
              onClick={() => onOpenChange(false)}
              className="link-underline mt-6 inline-block text-[11px] tracking-[0.24em] text-muted-foreground"
            >
              VIEW FULL DETAILS
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
