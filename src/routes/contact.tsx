import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { GoldDivider, Reveal } from "@/components/motion-kit";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Anusha's Elite" },
      { name: "description", content: "Talk to our stylists about drapes, commissions and wedding trousseau planning." },
      { property: "og:title", content: "Contact — Anusha's Elite" },
      { property: "og:description", content: "Our stylists are on WhatsApp daily 10am–8pm IST." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const { addMessage, user } = useStore();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-16 sm:px-8">
      <Reveal className="text-center">
        <p className="eyebrow">We'd love to help</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">Contact the atelier</h1>
        <GoldDivider className="mt-5" />
      </Reveal>

      <div className="mt-14 grid gap-12 lg:grid-cols-2">
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            addMessage({ name, email, subject, text });
            toast.success("Message sent", { description: "A stylist will reply within one working day." });
            setSubject(""); setText("");
          }}
        >
          <label className="block">
            <span className="eyebrow">Name</span>
            <input required value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold" />
          </label>
          <label className="block">
            <span className="eyebrow">Email</span>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold" />
          </label>
          <label className="block">
            <span className="eyebrow">Subject</span>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Wedding trousseau, sizing, order help…" className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold" />
          </label>
          <label className="block">
            <span className="eyebrow">Message</span>
            <textarea required rows={5} value={text} onChange={(e) => setText(e.target.value)} className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold" />
          </label>
          <button className="btn-shine w-full bg-charcoal py-4 text-[11px] tracking-[0.24em] text-ivory">SEND MESSAGE</button>
        </form>


        <div className="space-y-8">
          {[
            [Mail, "care@anushaselite.com", "Replies within one working day"],
            [Phone, "+91 90000 12345", "WhatsApp styling, 10am–8pm IST"],
            [MapPin, "Road No. 10, Banjara Hills, Hyderabad", "Atelier visits by appointment"],
          ].map(([Icon, title, sub]) => {
            const I = Icon as typeof Mail;
            return (
              <Reveal key={title as string} className="flex gap-4">
                <I className="mt-1 h-4 w-4 shrink-0 text-gold" />
                <div className="min-w-0">
                  <p className="text-sm">{title as string}</p>
                  <p className="mt-1 text-[12px] text-muted-foreground">{sub as string}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}
