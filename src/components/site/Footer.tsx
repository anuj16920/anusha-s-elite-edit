import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube } from "lucide-react";
import { toast } from "sonner";
import { Reveal, Stagger, StaggerItem, GoldDivider } from "@/components/motion-kit";

const COLUMNS = [
  { title: "Shop", links: [["All Sarees", "/shop"], ["Collections", "/collections"], ["Wishlist", "/wishlist"], ["Track Order", "/track"]] },
  { title: "House", links: [["Our Craft", "/about"], ["Contact", "/contact"], ["FAQ", "/faq"], ["Business Portal", "/admin"]] },
  { title: "Account", links: [["Sign In", "/auth"], ["My Orders", "/account"], ["Returns", "/account"], ["Addresses", "/account"]] },
] as const;

export function Footer() {
  return (
    <footer className="grain border-t border-border bg-champagne/40 px-5 pb-10 pt-16 sm:px-8">
      <div className="mx-auto max-w-[1400px]">
        <Reveal className="text-center">
          <p className="font-display text-3xl tracking-[0.28em]">ANUSHA&apos;S ELITE</p>
          <GoldDivider className="mt-4" />
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            Modernly curated. Beautifully woven. A house of handloom sarees from Hyderabad.
          </p>
        </Reveal>

        <Stagger className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {COLUMNS.map((col) => (
            <StaggerItem key={col.title}>
              <p className="eyebrow">{col.title}</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {col.links.map(([label, to]) => (
                  <li key={label}>
                    <Link to={to} className="link-underline text-muted-foreground transition-colors hover:text-foreground">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </StaggerItem>
          ))}
          <StaggerItem>
            <p className="eyebrow">The Atelier Letter</p>
            <p className="mt-4 text-sm text-muted-foreground">New drops, festive edits and styling notes. Once a fortnight.</p>
            <form
              className="mt-4 flex border border-border bg-background"
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Welcome to the house", { description: "Check your inbox for a 5% welcome code." });
                (e.currentTarget as HTMLFormElement).reset();
              }}
            >
              <input required type="email" placeholder="Email address" className="w-full bg-transparent px-3 py-3 text-sm outline-none" />
              <button className="btn-shine bg-charcoal px-4 text-[10px] tracking-[0.2em] text-ivory">JOIN</button>
            </form>
            <div className="mt-5 flex gap-4 text-muted-foreground">
              {[Instagram, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="#" aria-label="Social" className="transition-transform hover:-translate-y-0.5 hover:text-gold">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </StaggerItem>
        </Stagger>

        <div className="gold-rule mt-12 opacity-50" />
        <div className="mt-5 flex flex-col items-center justify-between gap-2 text-[11px] text-muted-foreground sm:flex-row">
          <p>© 2026 Anusha&apos;s Elite. All rights reserved.</p>
          <p>Handwoven in Kanchipuram, Varanasi & Chanderi.</p>
        </div>
      </div>
    </footer>
  );
}
