import { createFileRoute, notFound } from "@tanstack/react-router";
import { COLLECTIONS } from "@/data/catalog";
import { useStore } from "@/lib/store";
import { GoldDivider, Reveal } from "@/components/motion-kit";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/collections/$slug")({
  loader: ({ params }) => {
    const collection = COLLECTIONS.find((c) => c.slug === params.slug);
    if (!collection) throw notFound();
    return { collection };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Collection not found — Anusha's Elite" }, { name: "robots", content: "noindex" }] };
    const c = loaderData.collection;
    return {
      meta: [
        { title: `${c.name} — Anusha's Elite` },
        { name: "description", content: c.blurb },
        { property: "og:title", content: `${c.name} — Anusha's Elite` },
        { property: "og:description", content: c.blurb },
      ],
    };
  },
  component: CollectionPage,
});

function CollectionPage() {
  const { collection } = Route.useLoaderData();
  const { products: allProducts } = useStore();
  const products = allProducts.filter((p) => p.collection === collection.name);

  return (
    <div>
      <section className="relative h-[52vh] min-h-[340px] overflow-hidden">
        <img src={collection.image} alt={collection.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-charcoal/45" />
        <div className="absolute inset-0 grid place-items-center px-6 text-center text-ivory">
          <Reveal>
            <p className="eyebrow text-gold-soft">Collection</p>
            <h1 className="mt-3 font-display text-5xl sm:text-6xl">{collection.name}</h1>
            <p className="mx-auto mt-4 max-w-md text-sm text-ivory/85">{collection.blurb}</p>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8">
        <GoldDivider />
        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-6">
          {products.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
        </div>
      </div>
    </div>
  );
}
