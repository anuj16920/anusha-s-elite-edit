import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { GoldDivider, Reveal } from "@/components/motion-kit";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Track Your Order — Anusha's Elite" },
      { name: "description", content: "Enter your order number to follow your saree from atelier to doorstep." },
      { property: "og:title", content: "Track Your Order — Anusha's Elite" },
      { property: "og:description", content: "Follow your saree from atelier to doorstep." },
    ],
  }),
  component: Track,
});

function Track() {
  const { orders } = useStore();
  const navigate = useNavigate();
  const [id, setId] = useState("");

  return (
    <div className="mx-auto max-w-md px-5 py-20 sm:px-8">
      <Reveal className="text-center">
        <p className="eyebrow">Order tracking</p>
        <h1 className="mt-3 font-display text-4xl">Where is my saree?</h1>
        <GoldDivider className="mt-4" />
      </Reveal>
      <form
        className="mt-10"
        onSubmit={(e) => {
          e.preventDefault();
          const found = orders.find((o) => o.id.toLowerCase() === id.trim().toLowerCase().replace("#", ""));
          if (!found) return toast.error("No order found with that number", { description: "Try AE1022." });
          navigate({ to: "/order/$id", params: { id: found.id } });
        }}
      >
        <input value={id} onChange={(e) => setId(e.target.value)} placeholder="Order number e.g. AE1022" className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold" />
        <button className="btn-shine mt-4 w-full bg-charcoal py-4 text-[11px] tracking-[0.24em] text-ivory">TRACK ORDER</button>
      </form>
    </div>
  );
}
