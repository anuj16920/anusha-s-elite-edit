import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { SearchOverlay } from "./SearchOverlay";
import { CartDrawer } from "./CartDrawer";

const NAV = [
  { label: "Shop", to: "/shop" },
  { label: "Collections", to: "/collections" },
  { label: "Our Craft", to: "/about" },
  { label: "Contact", to: "/contact" },
] as const;

export function Header() {
  const { cartCount, wishlist, user } = useStore();
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bump, setBump] = useState(0);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const transparent = pathname === "/" && !solid;

  useMotionValueEvent(scrollY, "change", (v) => setSolid(v > 40));

  useEffect(() => {
    const openCart = () => setCartOpen(true);
    const added = () => setBump((b) => b + 1);
    window.addEventListener("ae:cart-open", openCart);
    window.addEventListener("ae:cart-added", added);
    return () => {
      window.removeEventListener("ae:cart-open", openCart);
      window.removeEventListener("ae:cart-added", added);
    };
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <>
      <div className="bg-charcoal py-2 text-center text-[10px] tracking-[0.28em] text-ivory">
        COMPLIMENTARY SHIPPING ON ORDERS ABOVE ₹5,000 · HANDWOVEN IN INDIA
      </div>

      <motion.header
        animate={{
          backgroundColor: transparent ? "oklch(0.982 0.006 85 / 0)" : "oklch(0.982 0.006 85 / 0.94)",
          boxShadow: transparent ? "0 0 0 rgba(0,0,0,0)" : "var(--shadow-soft)",
        }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "sticky top-0 z-[70] backdrop-blur-sm transition-[padding] duration-500",
          transparent ? "py-5" : "py-3",
        )}
      >
        <div className="mx-auto grid max-w-[1400px] grid-cols-[auto_1fr_auto] items-center gap-4 px-5 sm:px-8">
          <div className="flex items-center gap-6">
            <button className="lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
            <nav className="hidden items-center gap-7 lg:flex">
              {NAV.map((n) => (
                <Link key={n.to} to={n.to} className="link-underline text-[11px] tracking-[0.22em]">
                  {n.label.toUpperCase()}
                </Link>
              ))}
            </nav>
          </div>

          <Link to="/" className="justify-self-center text-center">
            <span className="font-display text-xl tracking-[0.3em] sm:text-2xl">ANUSHA&apos;S ELITE</span>
            <span className="mt-0.5 block text-[8px] tracking-[0.4em] text-gold">TIMELESS INDIAN ELEGANCE</span>
          </Link>

          <div className="flex items-center gap-4 justify-self-end sm:gap-5">
            <button onClick={() => setSearchOpen(true)} aria-label="Search" className="transition-transform hover:scale-110">
              <Search className="h-[18px] w-[18px]" />
            </button>
            <Link to="/wishlist" aria-label="Wishlist" className="relative hidden transition-transform hover:scale-110 sm:block">
              <Heart className="h-[18px] w-[18px]" />
              {wishlist.length > 0 && <Badge n={wishlist.length} />}
            </Link>
            <Link to={user ? "/account" : "/auth"} aria-label="Account" className="hidden transition-transform hover:scale-110 sm:block">
              <User className="h-[18px] w-[18px]" />
            </Link>
            <motion.button
              key={bump}
              animate={bump ? { scale: [1, 1.22, 0.96, 1] } : {}}
              transition={{ duration: 0.5 }}
              onClick={() => setCartOpen(true)}
              aria-label="Cart"
              className="relative"
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              {cartCount > 0 && <Badge n={cartCount} />}
            </motion.button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div className="fixed inset-0 z-[90] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
            <motion.nav
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-0 top-0 h-full w-[78%] max-w-xs bg-background p-6"
            >
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="mb-8">
                <X className="h-5 w-5" />
              </button>
              <div className="flex flex-col gap-5">
                {[...NAV, { label: "Wishlist", to: "/wishlist" }, { label: "Account", to: "/account" }, { label: "Track Order", to: "/track" }, { label: "FAQ", to: "/faq" }].map((n) => (
                  <Link key={n.to} to={n.to} className="font-display text-2xl">
                    {n.label}
                  </Link>
                ))}
              </div>
              <div className="gold-rule mt-8" />
              <Link to="/admin" className="eyebrow mt-6 block">
                Business portal
              </Link>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

function Badge({ n }: { n: number }) {
  return (
    <motion.span
      key={n}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-maroon px-1 text-[9px] text-ivory"
    >
      {n}
    </motion.span>
  );
}
