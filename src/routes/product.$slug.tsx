import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Heart, Minus, Plus, Star, Truck, RefreshCcw, ShieldCheck, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { findProduct } from "@/data/catalog";
import { inr, dateFmt } from "@/lib/format";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { GoldDivider, Reveal } from "@/components/motion-kit";
import { ProductCard } from "@/components/site/ProductCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = findProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Saree not found — Anusha's Elite" }, { name: "robots", content: "noindex" }] };
    const p = loaderData.product;
    return {
      meta: [
        { title: `${p.name} — Anusha's Elite` },
        { name: "description", content: `${p.name} in ${p.fabric}. ${inr(p.price)}. Handwoven, atelier finished, shipped worldwide.` },
        { property: "og:title", content: `${p.name} — Anusha's Elite` },
        { property: "og:description", content: `Handwoven ${p.fabric} saree, ${inr(p.price)}.` },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product: loaded } = Route.useLoaderData();
  const { addToCart, toggleWishlist, wishlist, markViewed, products, reviews: allReviews, addReview, user } = useStore();
  const [rForm, setRForm] = useState({ rating: 5, text: "" });
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [added, setAdded] = useState(false);
  const wished = wishlist.includes(product.slug);

  useEffect(() => {
    markViewed(product.slug);
    setActive(0);
  }, [product.slug, markViewed]);

  const product = products.find((p) => p.slug === loaded.slug) ?? loaded;
  const related = products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4);
  const reviews = allReviews.filter((r) => r.product === product.name && r.status === "Published");

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8">
      <nav className="eyebrow mb-8 flex gap-2">
        <Link to="/" className="hover:text-foreground">Home</Link>/
        <Link to="/shop" className="hover:text-foreground">Shop</Link>/
        <span className="text-foreground">{product.category}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-16">
        {/* Gallery */}
        <div className="grid gap-4 sm:grid-cols-[84px_minmax(0,1fr)]">
          <div className="no-scrollbar order-2 flex gap-3 overflow-x-auto sm:order-1 sm:flex-col">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={cn(
                  "relative h-24 w-[70px] shrink-0 overflow-hidden border transition-all duration-400",
                  active === i ? "border-gold" : "border-transparent opacity-60 hover:opacity-100",
                )}
              >
                <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>

          <div
            className="relative order-1 aspect-[3/4] overflow-hidden bg-secondary sm:order-2"
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
            }}
            onMouseLeave={() => setZoom(null)}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={active}
                src={product.images[active]}
                alt={product.name}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: zoom ? 1.9 : 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: zoom ? `${zoom.x}% ${zoom.y}%` : "center" }}
                className="h-full w-full object-cover"
              />
            </AnimatePresence>
          </div>
        </div>

        {/* Info */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <p className="eyebrow">{product.collection}</p>
            <h1 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">{product.name}</h1>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={cn("h-3.5 w-3.5", i < Math.round(product.rating) && "fill-gold")} />
                ))}
              </span>
              {product.rating} · {product.reviews} reviews
            </div>
            <div className="mt-5 flex items-baseline gap-3">
              <span className="font-display text-3xl">{inr(product.price)}</span>
              <span className="text-sm text-muted-foreground line-through">{inr(product.mrp)}</span>
              <span className="text-sm text-gold">{Math.round(((product.mrp - product.price) / product.mrp) * 100)}% off</span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">Inclusive of all taxes · Ships in 2–3 working days</p>

            <div className="gold-rule my-7" />

            <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>

            <p className={cn("mt-6 text-xs tracking-[0.16em]", product.stock === 0 ? "text-destructive" : product.stock < 6 ? "text-maroon" : "text-success")}>
              {product.stock === 0 ? "SOLD OUT" : product.stock < 6 ? `ONLY ${product.stock} LEFT ON THE LOOM` : "IN STOCK"}
            </p>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center border border-border">
                <button className="p-3" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease"><Minus className="h-3.5 w-3.5" /></button>
                <span className="w-10 text-center text-sm">{qty}</span>
                <button className="p-3" onClick={() => setQty((q) => q + 1)} aria-label="Increase"><Plus className="h-3.5 w-3.5" /></button>
              </div>
              <button
                disabled={product.stock === 0}
                onClick={() => {
                  addToCart(product.slug, qty);
                  window.dispatchEvent(new CustomEvent("ae:cart-added"));
                  setAdded(true);
                  setTimeout(() => setAdded(false), 1600);
                  toast.success("Added to cart", { description: `${qty} × ${product.name}` });
                }}
                className="btn-shine flex-1 bg-charcoal py-4 text-[11px] tracking-[0.24em] text-ivory transition-colors hover:bg-maroon disabled:opacity-40"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {added ? (
                    <motion.span key="ok" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-2">
                      <Check className="h-4 w-4" /> ADDED
                    </motion.span>
                  ) : (
                    <motion.span key="add" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      ADD TO CART
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
              <button
                aria-label="Wishlist"
                onClick={() => {
                  const a = toggleWishlist(product.slug);
                  toast[a ? "success" : "message"](a ? "Added to your collection" : "Removed from your collection");
                }}
                className="grid h-[50px] w-[50px] place-items-center border border-border transition-transform hover:scale-105 active:scale-90"
              >
                <Heart className={cn("h-4 w-4", wished && "fill-maroon text-maroon")} />
              </button>
            </div>

            <Link
              to="/checkout"
              onClick={() => addToCart(product.slug, qty)}
              className="mt-3 block border border-charcoal py-4 text-center text-[11px] tracking-[0.24em] transition-colors hover:bg-charcoal hover:text-ivory"
            >
              BUY NOW
            </Link>

            <div className="mt-8 grid grid-cols-3 gap-3 border-y border-border py-5 text-center">
              {[[Truck, "Free shipping"], [RefreshCcw, "7-day returns"], [ShieldCheck, "Tested zari"]].map(([Icon, label]) => {
                const I = Icon as typeof Truck;
                return (
                  <div key={label as string} className="flex flex-col items-center gap-2">
                    <I className="h-4 w-4 text-gold" />
                    <span className="text-[10px] tracking-[0.14em] text-muted-foreground">{(label as string).toUpperCase()}</span>
                  </div>
                );
              })}
            </div>

            <Accordion type="single" collapsible className="mt-4">
              <AccordionItem value="details">
                <AccordionTrigger className="text-[11px] tracking-[0.2em]">PRODUCT DETAILS</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {product.details.map((d) => <li key={d}>{d}</li>)}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping">
                <AccordionTrigger className="text-[11px] tracking-[0.2em]">SHIPPING & RETURNS</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  Dispatched in 2–3 working days from Hyderabad. Complimentary insured shipping across India above ₹5,000, and
                  tracked international delivery in 5–9 days. Returns accepted within 7 days on unworn, untailored pieces.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="care">
                <AccordionTrigger className="text-[11px] tracking-[0.2em]">CARE</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  Dry clean only. Store wrapped in muslin, away from direct light, and refold along a different line every few months.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Reveal>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-24">
        <Reveal className="text-center">
          <p className="eyebrow">Reviews</p>
          <h2 className="mt-2 font-display text-3xl">What customers say</h2>
          <GoldDivider className="mt-4" />
        </Reveal>
        <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
          {reviews.map((r) => (
            <Reveal key={r.customer + r.date}>
              <div className="h-full border border-border bg-card p-6">
                <div className="flex gap-0.5 text-gold">
                  {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-gold" />)}
                </div>
                <p className="mt-3 text-sm leading-relaxed">{r.text}</p>
                <p className="eyebrow mt-4">{r.customer} · {dateFmt(r.date)}</p>
              </div>
            </Reveal>
          ))}
          {!reviews.length && <p className="sm:col-span-2 text-center text-sm text-muted-foreground">No reviews yet — be the first to write one.</p>}
        </div>

        <form
          className="mx-auto mt-10 max-w-2xl border border-border bg-card p-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (!rForm.text.trim()) { toast.error("Write a few words first."); return; }
            addReview({ product: product.name, customer: user?.name ?? "Guest", rating: rForm.rating, text: rForm.text });
            toast.success("Thank you", { description: "Your review is awaiting moderation." });
            setRForm({ rating: 5, text: "" });
          }}
        >
          <p className="eyebrow">Write a review</p>
          <div className="mt-3 flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button type="button" key={n} onClick={() => setRForm({ ...rForm, rating: n })} aria-label={`${n} star`}>
                <Star className={cn("h-5 w-5", n <= rForm.rating ? "fill-gold text-gold" : "text-muted-foreground")} />
              </button>
            ))}
          </div>
          <textarea rows={3} value={rForm.text} onChange={(e) => setRForm({ ...rForm, text: e.target.value })} placeholder="How did it drape?" className="mt-4 w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold" />
          <button className="btn-shine mt-4 bg-charcoal px-6 py-3 text-[11px] tracking-[0.2em] text-ivory">SUBMIT REVIEW</button>
        </form>
      </section>

      {/* Related */}
      <section className="mt-24">
        <Reveal>
          <p className="eyebrow">You may also like</p>
          <h2 className="mt-2 font-display text-3xl">More from {product.category}</h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-6">
          {related.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
        </div>
      </section>
    </div>
  );
}
