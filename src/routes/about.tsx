import { createFileRoute } from "@tanstack/react-router";
import { IMAGES } from "@/data/catalog";
import { Counter, GoldDivider, Reveal, RevealImage, Stagger, StaggerItem } from "@/components/motion-kit";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Craft — Anusha's Elite" },
      { name: "description", content: "How Anusha's Elite works with 128 weaver families across Kanchipuram, Varanasi and Chanderi." },
      { property: "og:title", content: "Our Craft — Anusha's Elite" },
      { property: "og:description", content: "Forty days on one loom. The story behind every drape." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div>
      <section className="relative h-[52vh] min-h-[320px] overflow-hidden">
        <img src={IMAGES.craft} alt="Gold zari woven into silk" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-charcoal/45" />
        <div className="absolute inset-0 grid place-items-center px-6 text-center text-ivory">
          <Reveal>
            <p className="eyebrow text-gold-soft">Since 2014</p>
            <h1 className="mt-3 font-display text-5xl">Made with intention</h1>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8">
        <Reveal>
          <p className="font-display text-2xl leading-relaxed">
            Anusha&apos;s Elite began in a Hyderabad living room with three sarees and a stubborn belief: that handloom deserves
            modern presentation, honest pricing and a weaver who is paid properly.
          </p>
        </Reveal>
        <GoldDivider className="my-10" />
        <Reveal delay={0.1}>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Today we work directly with 128 weaver families across twelve clusters. We commission in small runs, photograph every
            piece as it actually is, and finish each saree in our own atelier before it ships. No middlemen, no mystery fabric.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 pb-20 sm:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {[IMAGES.p1, IMAGES.wedding, IMAGES.festive].map((src, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <RevealImage src={src} alt="Atelier photography" ratio="aspect-[3/4]" />
            </Reveal>
          ))}
        </div>
        <Stagger className="mt-16 grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
          {[[128, "Weaver families"], [12, "Clusters"], [26400, "Sarees delivered"], [24, "Countries shipped"]].map(([n, l]) => (
            <StaggerItem key={l as string}>
              <p className="font-display text-4xl text-gold"><Counter value={n as number} suffix="+" /></p>
              <p className="mt-1 text-[11px] tracking-[0.16em] text-muted-foreground">{(l as string).toUpperCase()}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </div>
  );
}
