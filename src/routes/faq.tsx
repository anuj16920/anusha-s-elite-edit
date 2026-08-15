import { createFileRoute } from "@tanstack/react-router";
import { FAQS } from "@/data/catalog";
import { GoldDivider, Reveal } from "@/components/motion-kit";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Anusha's Elite" },
      { name: "description", content: "Shipping, zari grades, fall & pico, returns and styling support — answered." },
      { property: "og:title", content: "FAQ — Anusha's Elite" },
      { property: "og:description", content: "Everything about shipping, zari, tailoring and returns." },
    ],
  }),
  component: Faq,
});

function Faq() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
      <Reveal className="text-center">
        <p className="eyebrow">Good to know</p>
        <h1 className="mt-3 font-display text-4xl">Frequently asked</h1>
        <GoldDivider className="mt-5" />
      </Reveal>
      <Accordion type="single" collapsible className="mt-10">
        {FAQS.map((f) => (
          <AccordionItem key={f.q} value={f.q}>
            <AccordionTrigger className="text-left font-display text-lg">{f.q}</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
