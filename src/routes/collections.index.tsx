import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { COLLECTIONS } from "@/data/catalog";
import { GoldDivider, Reveal } from "@/components/motion-kit";

export const Route = createFileRoute("/collections/")({
  head: () => ({
    meta: [
      { title: "Collections — Anusha's Elite" },
      { name: "description", content: "The Wedding Edit, Festive Gold, Bridal Ivory and Everyday Luxe — curated saree collections from Anusha's Elite." },
      { property: "og:title", content: "Collections — Anusha's Elite" },
      { property: "og:description", content: "Curated saree edits for weddings, festivals and everyday luxury." },
    ],
  }),
  component: CollectionsPage,
});

function CollectionsPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8">
      <Reveal className="text-center">
        <p className="eyebrow">Curated edits</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">Collections</h1>
        <GoldDivider className="mt-5" />
      </Reveal>

      <div className="mt-14 space-y-6">
        {COLLECTIONS.map((c, i) => (
          <Reveal key={c.slug} delay={i * 0.05}>
            <Link to="/collections/$slug" params={{ slug: c.slug }} className="group grid items-center gap-6 md:grid-cols-2">
              <div className={`relative aspect-[16/10] overflow-hidden ${i % 2 ? "md:order-2" : ""}`}>
                <img src={c.image} alt={c.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
              </div>
              <div className="px-1">
                <p className="eyebrow">Edit {String(i + 1).padStart(2, "0")}</p>
                <h2 className="mt-2 font-display text-3xl sm:text-4xl">{c.name}</h2>
                <div className="gold-rule my-4 w-16" />
                <p className="max-w-sm text-sm text-muted-foreground">{c.blurb}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-[11px] tracking-[0.22em]">
                  EXPLORE COLLECTION
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1.5" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
