import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Search, Heart, User, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function MobileNav({ onSearch }: { onSearch: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { cartCount, wishlist } = useStore();

  const items = [
    { icon: Home, label: "Home", to: "/" as const },
    { icon: Search, label: "Shop", to: "/shop" as const },
    { icon: Heart, label: "Wishlist", to: "/wishlist" as const, count: wishlist.length },
    { icon: User, label: "Account", to: "/account" as const },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-[75] grid grid-cols-5 border-t border-border bg-background/95 backdrop-blur-md md:hidden">
      {items.map(({ icon: Icon, label, to, count }) => {
        const active = pathname === to;
        return (
          <Link key={label} to={to} className="relative flex flex-col items-center gap-1 py-2.5">
            <Icon className={cn("h-[18px] w-[18px]", active ? "text-gold" : "text-muted-foreground")} />
            <span className={cn("text-[9px] tracking-[0.14em]", active ? "text-foreground" : "text-muted-foreground")}>
              {label.toUpperCase()}
            </span>
            {!!count && <span className="absolute right-5 top-1.5 h-1.5 w-1.5 rounded-full bg-maroon" />}
            {active && <motion.span layoutId="mnav" className="absolute inset-x-6 top-0 h-px bg-gold" />}
          </Link>
        );
      })}
      <button onClick={() => window.dispatchEvent(new CustomEvent("ae:cart-open"))} className="relative flex flex-col items-center gap-1 py-2.5">
        <ShoppingBag className="h-[18px] w-[18px] text-muted-foreground" />
        <span className="text-[9px] tracking-[0.14em] text-muted-foreground">CART</span>
        {cartCount > 0 && <span className="absolute right-5 top-1.5 h-1.5 w-1.5 rounded-full bg-maroon" />}
      </button>
      <button onClick={onSearch} className="sr-only">
        Search
      </button>
    </nav>
  );
}
