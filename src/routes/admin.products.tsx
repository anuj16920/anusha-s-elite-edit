import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { CATEGORIES, COLLECTIONS, IMAGES, type Product } from "@/data/catalog";
import { inr } from "@/lib/format";
import { Reveal } from "@/components/motion-kit";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/products")({
  head: () => ({
    meta: [
      { title: "Products — Anusha's Elite Business Portal" },
      { name: "description", content: "Manage products for Anusha's Elite." },
      { property: "og:title", content: "Products — Anusha's Elite" },
      { property: "og:description", content: "Manage products." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Page,
});

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const emptyDraft = {
  slug: "",
  name: "",
  price: 9999,
  mrp: 12999,
  category: CATEGORIES[0]!.name,
  collection: COLLECTIONS[0]!.name,
  fabric: "Silk",
  colour: "Gold",
  occasion: "Festive",
  stock: 10,
};

function Page() {
  const { products, saveProduct, deleteProduct } = useStore();
  const [q, setQ] = useState("");
  const [draft, setDraft] = useState<typeof emptyDraft | null>(null);

  const rows = products.filter((p) => (p.name + p.category + p.fabric).toLowerCase().includes(q.trim().toLowerCase()));

  const submit = () => {
    if (!draft || !draft.name.trim()) { toast.error("Product needs a name."); return; }
    const slug = draft.slug || slugify(draft.name);
    const existing = products.find((p) => p.slug === slug);
    const product: Product = {
      ...(existing ?? {
        id: "AE-" + Math.floor(2000 + Math.random() * 900),
        rating: 4.6,
        reviews: 0,
        images: [IMAGES.p1, IMAGES.p2, IMAGES.p3, IMAGES.craft],
        description: "A new drape from the atelier, woven with restraint and finished by hand.",
        details: ["Length: 5.5m saree with 0.8m unstitched blouse piece", "Care: Dry clean only"],
        createdAt: new Date().toISOString(),
        badge: "New",
      }),
      slug,
      name: draft.name,
      price: Number(draft.price),
      mrp: Number(draft.mrp),
      category: draft.category,
      collection: draft.collection,
      fabric: draft.fabric,
      colour: draft.colour,
      occasion: draft.occasion,
      stock: Number(draft.stock),
    } as Product;
    saveProduct(product);
    toast.success(existing ? "Product updated" : "Product added");
    setDraft(null);
  };

  const field = "mt-1 w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold";

  return (
    <div className="space-y-6">
      <Reveal className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Business portal</p>
          <h1 className="mt-2 font-display text-3xl">Products</h1>
        </div>
        <button onClick={() => setDraft(draft ? null : { ...emptyDraft })} className="btn-shine bg-charcoal px-5 py-3 text-[11px] tracking-[0.2em] text-ivory">
          {draft ? "CLOSE" : "ADD PRODUCT"}
        </button>
      </Reveal>

      {draft && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 border border-border bg-card p-5 sm:grid-cols-3">
          <label className="block sm:col-span-2"><span className="eyebrow">Name</span><input className={field} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></label>
          <label className="block"><span className="eyebrow">Stock</span><input type="number" className={field} value={draft.stock} onChange={(e) => setDraft({ ...draft, stock: +e.target.value })} /></label>
          <label className="block"><span className="eyebrow">Price</span><input type="number" className={field} value={draft.price} onChange={(e) => setDraft({ ...draft, price: +e.target.value })} /></label>
          <label className="block"><span className="eyebrow">MRP</span><input type="number" className={field} value={draft.mrp} onChange={(e) => setDraft({ ...draft, mrp: +e.target.value })} /></label>
          <label className="block"><span className="eyebrow">Fabric</span><input className={field} value={draft.fabric} onChange={(e) => setDraft({ ...draft, fabric: e.target.value })} /></label>
          <label className="block"><span className="eyebrow">Category</span>
            <select className={field} value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })}>{CATEGORIES.map((c) => <option key={c.slug}>{c.name}</option>)}</select>
          </label>
          <label className="block"><span className="eyebrow">Collection</span>
            <select className={field} value={draft.collection} onChange={(e) => setDraft({ ...draft, collection: e.target.value })}>{COLLECTIONS.map((c) => <option key={c.slug}>{c.name}</option>)}</select>
          </label>
          <label className="block"><span className="eyebrow">Colour</span><input className={field} value={draft.colour} onChange={(e) => setDraft({ ...draft, colour: e.target.value })} /></label>
          <div className="sm:col-span-3">
            <button onClick={submit} className="btn-shine bg-maroon px-6 py-3 text-[11px] tracking-[0.2em] text-ivory">SAVE PRODUCT</button>
          </div>
        </motion.div>
      )}

      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" className="w-full max-w-xs border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold" />

      <Reveal delay={0.05} className="border border-border bg-card p-5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[10px] tracking-[0.16em] text-muted-foreground">
                {["PRODUCT", "CATEGORY", "FABRIC", "STOCK", "PRICE", ""].map((h) => (<th key={h} className="py-2 pr-4">{h}</th>))}
              </tr>
            </thead>
            <tbody>
              {rows.map((p, i) => (
                <motion.tr key={p.slug} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="border-b border-border/60 transition-colors hover:bg-secondary/60">
                  <td className="py-3 pr-4">{p.name}</td>
                  <td className="pr-4 text-muted-foreground">{p.category}</td>
                  <td className="pr-4 text-muted-foreground">{p.fabric}</td>
                  <td className="pr-4"><span className="border border-gold/50 px-2 py-0.5 text-[10px] tracking-[0.12em] text-gold">{p.stock} in stock</span></td>
                  <td className="pr-4">{inr(p.price)}</td>
                  <td className="space-x-3 pr-4 text-[10px] tracking-[0.16em]">
                    <button className="link-underline text-muted-foreground" onClick={() => setDraft({ slug: p.slug, name: p.name, price: p.price, mrp: p.mrp, category: p.category, collection: p.collection, fabric: p.fabric, colour: p.colour, occasion: p.occasion, stock: p.stock })}>EDIT</button>
                    <button className="link-underline text-maroon" onClick={() => { deleteProduct(p.slug); toast.success("Product removed"); }}>DELETE</button>
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
