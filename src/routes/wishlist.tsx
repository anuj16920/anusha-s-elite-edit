import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

import { useStore } from "@/lib/store";
import { GoldDivider, Reveal } from "@/components/motion-kit";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Your Collection — Anusha's Elite" },
      { name: "description", content: "The sarees you've saved to your personal collection." },
      { property: "og:title", content: "Your Collection — Anusha's Elite" },
      { property: "og:description", content: "Saved sarees, ready when you are." },
    ],
  }),
  component: Wishlist,
});

function Wishlist() {
  const { wishlist, products } = useStore();
  const items = wishlist.map((s) => products.find((p) => p.slug === s)).filter(Boolean);

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8">
      <Reveal className="text-center">
        <p className="eyebrow">Saved pieces</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">Your collection</h1>
        <GoldDivider className="mt-5" />
      </Reveal>

      {items.length === 0 ? (
        <div className="grid place-items-center py-24 text-center">
          <Heart className="h-8 w-8 text-gold" />
          <p className="mt-5 font-display text-2xl">Your collection is waiting.</p>
          <Link to="/shop" className="btn-shine mt-6 bg-charcoal px-8 py-4 text-[11px] tracking-[0.24em] text-ivory">EXPLORE SAREES</Link>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-6">
          {items.map((p, i) => <ProductCard key={p!.slug} product={p!} index={i} />)}
        </div>
      )}
    </div>
  );
}
