import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { ArrowRight, Truck, ShieldCheck, Sparkles, RefreshCcw, Star } from "lucide-react";
import { useRef } from "react";
import { CATEGORIES, COLLECTIONS, IMAGES, PRODUCTS, TESTIMONIALS } from "@/data/catalog";
import { Counter, GoldDivider, Magnetic, Reveal, RevealImage, Stagger, StaggerItem } from "@/components/motion-kit";
import { ProductCard } from "@/components/site/ProductCard";
import { useStore } from "@/lib/store";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Anusha's Elite — Handwoven Luxury Sarees" },
      { name: "description", content: "Timeless Indian elegance, modernly curated. Handwoven Kanjeevaram, Banarasi, organza and tissue sarees." },
      { property: "og:title", content: "Anusha's Elite — Handwoven Luxury Sarees" },
      { property: "og:description", content: "Timeless Indian elegance, modernly curated. Beautifully woven." },
    ],
  }),
  component: Home,
});

function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "12%"]);
  const heroFade = useTransform(scrollYProgress, [0, 1], [1, 0.35]);
  const { recent } = useStore();

  const newArrivals = PRODUCTS.filter((p) => p.collection === "New Arrivals" || p.badge === "New").slice(0, 4);
  const bestSellers = PRODUCTS.filter((p) => p.badge === "Bestseller" || p.rating >= 4.8).slice(0, 4);
  const recentProducts = recent.map((s) => PRODUCTS.find((p) => p.slug === s)).filter(Boolean).slice(0, 6);

  return (
    <div>
      {/* HERO */}
      <section ref={heroRef} className="relative -mt-[92px] h-[92vh] min-h-[620px] overflow-hidden">
        <motion.div style={{ y: heroY, opacity: heroFade }} className="absolute inset-0">
          <motion.img
            src={hero}
            alt="Model wearing a maroon Banarasi silk saree in a heritage courtyard"
            initial={{ scale: 1.06, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            className="h-full w-full object-cover object-center"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="absolute inset-0 bg-gradient-to-r from-charcoal/55 via-charcoal/20 to-transparent"
        />

        <div className="relative mx-auto flex h-full max-w-[1400px] items-end px-5 pb-20 sm:px-8 md:items-center md:pb-0">
          <div className="max-w-xl text-ivory">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="eyebrow text-gold-soft"
            >
              Autumn / Wedding 2026
            </motion.p>

            <h1 className="mt-4 font-display text-[2.6rem] leading-[1.05] sm:text-6xl lg:text-7xl">
              {["Sarees that tell", "your story."].map((line, i) => (
                <span key={line} className="block overflow-hidden">
                  <motion.span
                    className="block"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1, delay: 1 + i * 0.16, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.5 }}
              className="mt-5 max-w-md text-sm leading-relaxed text-ivory/85 sm:text-base"
            >
              Handwoven in Kanchipuram, Varanasi and Chanderi. Timeless Indian elegance, modernly curated for the way you live now.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.75 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Magnetic>
                <Link
                  to="/shop"
                  className="btn-shine group inline-flex items-center gap-3 bg-ivory px-8 py-4 text-[11px] tracking-[0.26em] text-charcoal"
                >
                  SHOP COLLECTION
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1.5" />
                </Link>
              </Magnetic>
              <Magnetic>
                <Link
                  to="/collections/$slug"
                  params={{ slug: "wedding-edit" }}
                  className="group inline-flex items-center gap-3 border border-ivory/60 px-8 py-4 text-[11px] tracking-[0.26em] text-ivory transition-colors hover:bg-ivory/10"
                >
                  THE WEDDING EDIT
                </Link>
              </Magnetic>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <Stagger className="grid grid-cols-2 gap-px border-y border-border bg-border lg:grid-cols-4">
        {[
          [Truck, "Complimentary shipping", "On orders above ₹5,000"],
          [ShieldCheck, "Tested zari", "Certified on every signature piece"],
          [Sparkles, "Atelier finished", "Hand-checked in Hyderabad"],
          [RefreshCcw, "7-day returns", "Unworn, untailored pieces"],
        ].map(([Icon, title, sub]) => {
          const I = Icon as typeof Truck;
          return (
            <StaggerItem key={title as string} className="bg-background">
              <div className="flex items-start gap-3 px-5 py-6 sm:px-8">
                <I className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <div className="min-w-0">
                  <p className="text-xs tracking-[0.12em]">{title as string}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{sub as string}</p>
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8">
        <Reveal className="text-center">
          <p className="eyebrow">Shop by category</p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl">A weave for every occasion</h2>
          <GoldDivider className="mt-5" />
        </Reveal>

        <div className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible lg:grid-cols-6">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.07} className="min-w-[62%] snap-start sm:min-w-0">
              <Link to="/shop" search={{ category: c.name }} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-charcoal/10 to-transparent transition-opacity duration-500 group-hover:from-charcoal/85" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-ivory transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5">
                    <p className="font-display text-xl">{c.name}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-[10px] tracking-[0.2em] opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      EXPLORE
                      <ArrowRight className="h-3 w-3 transition-transform duration-500 group-hover:translate-x-1" />
                    </p>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <Section title="New arrivals" eyebrow="This week at the atelier" link="/shop">
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-6">
          {newArrivals.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </div>
      </Section>

      {/* WEDDING EDITORIAL */}
      <EditorialBanner
        image={IMAGES.wedding}
        eyebrow="The Wedding Edit"
        title="For the seven vows"
        text="Bridal reds, temple borders and gold that catches candlelight. Commissioned pieces available with a 6-week lead time."
        cta="EXPLORE THE EDIT"
        to="wedding-edit"
      />

      {/* BEST SELLERS */}
      <Section title="Best sellers" eyebrow="Loved by the house" link="/shop">
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-6">
          {bestSellers.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </div>
      </Section>

      {/* CRAFTSMANSHIP */}
      <section className="grain bg-champagne/40 px-5 py-24 sm:px-8">
        <div className="mx-auto grid max-w-[1400px] items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <RevealImage src={IMAGES.craft} alt="Macro detail of gold zari woven into silk" ratio="aspect-[4/3]" />
          </Reveal>
          <div>
            <Reveal>
              <p className="eyebrow">Made with intention</p>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl">Forty days on one loom</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="gold-rule my-6 w-24" />
              <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
                Every Anusha&apos;s Elite saree begins with a conversation between a weaver and a colourist. Warp threads are
                counted by hand, zari is tested for purity, and each motif is set on the loom before a single pick is thrown.
                What arrives at your door carries roughly forty days of somebody&apos;s attention.
              </p>
            </Reveal>
            <Stagger className="mt-10 grid grid-cols-3 gap-6">
              {[
                [128, "Weaver families"],
                [40, "Days per saree"],
                [12, "Weaving clusters"],
              ].map(([n, label]) => (
                <StaggerItem key={label as string}>
                  <p className="font-display text-4xl text-gold">
                    <Counter value={n as number} suffix="+" />
                  </p>
                  <p className="mt-1 text-[11px] tracking-[0.16em] text-muted-foreground">{(label as string).toUpperCase()}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* FESTIVE */}
      <EditorialBanner
        image={IMAGES.festive}
        eyebrow="Festive Gold"
        title="Lit from within"
        text="Marigold yellows, temple golds and drapes built for long evenings and longer celebrations."
        cta="SHOP FESTIVE"
        to="festive-gold"
        flip
      />

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8">
        <Reveal className="text-center">
          <p className="eyebrow">In their words</p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl">From our customers</h2>
          <GoldDivider className="mt-5" />
        </Reveal>
        <Stagger className="mt-12 grid gap-6 md:grid-cols-3" gap={0.09}>
          {TESTIMONIALS.map((t) => (
            <StaggerItem key={t.name}>
              <figure className="h-full border border-border bg-card p-7 transition-shadow duration-500 hover:shadow-[var(--shadow-lift)]">
                <div className="flex gap-0.5 text-gold">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-gold" />
                  ))}
                </div>
                <blockquote className="mt-4 font-display text-xl leading-relaxed">“{t.text}”</blockquote>
                <figcaption className="mt-5 text-[11px] tracking-[0.18em] text-muted-foreground">
                  {t.name.toUpperCase()} · {t.city.toUpperCase()} · VERIFIED CUSTOMER
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* RECENTLY VIEWED */}
      {recentProducts.length > 0 && (
        <Section title="Recently viewed" eyebrow="Pick up where you left off" link="/shop">
          <div className="no-scrollbar flex snap-x gap-4 overflow-x-auto pb-2">
            {recentProducts.map((p, i) => (
              <div key={p!.slug} className="min-w-[58%] snap-start sm:min-w-[30%] lg:min-w-[23%]">
                <ProductCard product={p!} index={i} />
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* INSTAGRAM */}
      <section className="mx-auto max-w-[1400px] px-5 pb-24 sm:px-8">
        <Reveal className="text-center">
          <p className="eyebrow">@anushaselite</p>
          <h2 className="mt-3 font-display text-4xl">Draped by you</h2>
        </Reveal>
        <Stagger className="mt-10 grid grid-cols-3 gap-2 sm:gap-4 lg:grid-cols-6">
          {[IMAGES.p1, IMAGES.p2, IMAGES.p3, IMAGES.p4, IMAGES.wedding, IMAGES.festive].map((src, i) => (
            <StaggerItem key={i}>
              <div className="group relative aspect-square overflow-hidden">
                <img src={src} alt="Customer wearing Anusha's Elite" loading="lazy" className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-110" />
                <div className="absolute inset-0 bg-charcoal/0 transition-colors duration-500 group-hover:bg-charcoal/25" />
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </div>
  );
}

function Section({ title, eyebrow, link, children }: { title: string; eyebrow: string; link: "/shop"; children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8">
      <Reveal className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
        <div className="min-w-0">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl">{title}</h2>
        </div>
        <Link to={link} className="link-underline shrink-0 text-[11px] tracking-[0.22em] text-muted-foreground">
          VIEW ALL
        </Link>
      </Reveal>
      <div className="mt-10">{children}</div>
    </section>
  );
}

function EditorialBanner({
  image,
  eyebrow,
  title,
  text,
  cta,
  to,
  flip,
}: {
  image: string;
  eyebrow: string;
  title: string;
  text: string;
  cta: string;
  to: string;
  flip?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["-6%", "6%"]);

  return (
    <section ref={ref} className="relative h-[70vh] min-h-[460px] overflow-hidden">
      <motion.img src={image} alt={title} loading="lazy" style={{ y, scale: 1.14 }} className="absolute inset-0 h-full w-full object-cover" />
      <div className={`absolute inset-0 bg-gradient-to-${flip ? "l" : "r"} from-charcoal/70 via-charcoal/25 to-transparent`} />
      <div className={`relative mx-auto flex h-full max-w-[1400px] items-center px-5 sm:px-8 ${flip ? "justify-end" : ""}`}>
        <Reveal className="max-w-md text-ivory">
          <p className="eyebrow text-gold-soft">{eyebrow}</p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl">{title}</h2>
          <div className="gold-rule my-5 w-20" />
          <p className="text-sm leading-relaxed text-ivory/85">{text}</p>
          <Magnetic className="mt-8">
            <Link
              to="/collections/$slug"
              params={{ slug: to }}
              className="btn-shine group inline-flex items-center gap-3 bg-ivory px-8 py-4 text-[11px] tracking-[0.24em] text-charcoal"
            >
              {cta}
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1.5" />
            </Link>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}
