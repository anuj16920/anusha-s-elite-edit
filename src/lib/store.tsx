import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { COUPONS, ORDERS, PRODUCTS, type Order, type Product } from "@/data/catalog";

export type CartLine = { slug: string; qty: number };

type Store = {
  cart: CartLine[];
  wishlist: string[];
  recent: string[];
  coupon: string | null;
  orders: Order[];
  user: { name: string; email: string } | null;
  addToCart: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  removeFromCart: (slug: string) => void;
  clearCart: () => void;
  toggleWishlist: (slug: string) => boolean;
  markViewed: (slug: string) => void;
  applyCoupon: (code: string) => { ok: boolean; message: string };
  clearCoupon: () => void;
  placeOrder: (customer: { name: string; email: string; address: string }) => Order;
  signIn: (name: string, email: string) => void;
  signOut: () => void;
  cartCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  cartProducts: { product: Product; qty: number }[];
};

const StoreCtx = createContext<Store | null>(null);

const read = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [coupon, setCoupon] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>(ORDERS);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    setCart(read<CartLine[]>("ae_cart", []));
    setWishlist(read<string[]>("ae_wishlist", []));
    setRecent(read<string[]>("ae_recent", []));
    setCoupon(read<string | null>("ae_coupon", null));
    setUser(read<{ name: string; email: string } | null>("ae_user", null));
    setOrders(read<Order[]>("ae_orders", ORDERS));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("ae_cart", JSON.stringify(cart));
    localStorage.setItem("ae_wishlist", JSON.stringify(wishlist));
    localStorage.setItem("ae_recent", JSON.stringify(recent));
    localStorage.setItem("ae_coupon", JSON.stringify(coupon));
    localStorage.setItem("ae_user", JSON.stringify(user));
    localStorage.setItem("ae_orders", JSON.stringify(orders));
  }, [hydrated, cart, wishlist, recent, coupon, user, orders]);

  const addToCart = useCallback((slug: string, qty = 1) => {
    setCart((c) => {
      const found = c.find((l) => l.slug === slug);
      return found ? c.map((l) => (l.slug === slug ? { ...l, qty: l.qty + qty } : l)) : [...c, { slug, qty }];
    });
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setCart((c) => (qty <= 0 ? c.filter((l) => l.slug !== slug) : c.map((l) => (l.slug === slug ? { ...l, qty } : l))));
  }, []);

  const removeFromCart = useCallback((slug: string) => setCart((c) => c.filter((l) => l.slug !== slug)), []);
  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((slug: string) => {
    let added = false;
    setWishlist((w) => {
      added = !w.includes(slug);
      return added ? [slug, ...w] : w.filter((s) => s !== slug);
    });
    return added;
  }, []);

  const markViewed = useCallback((slug: string) => {
    setRecent((r) => [slug, ...r.filter((s) => s !== slug)].slice(0, 8));
  }, []);

  const cartProducts = useMemo(
    () =>
      cart
        .map((l) => ({ product: PRODUCTS.find((p) => p.slug === l.slug)!, qty: l.qty }))
        .filter((l) => Boolean(l.product)),
    [cart],
  );

  const subtotal = cartProducts.reduce((s, l) => s + l.product.price * l.qty, 0);
  const activeCoupon = COUPONS.find((c) => c.code === coupon && c.status === "Active");
  const discount = activeCoupon
    ? activeCoupon.type === "percent"
      ? Math.round((subtotal * activeCoupon.value) / 100)
      : activeCoupon.value
    : 0;
  const shipping = subtotal > 0 && subtotal - discount < 5000 ? 199 : 0;
  const total = Math.max(0, subtotal - discount + shipping);
  const cartCount = cart.reduce((s, l) => s + l.qty, 0);

  const applyCoupon = useCallback(
    (code: string) => {
      const found = COUPONS.find((c) => c.code.toLowerCase() === code.trim().toLowerCase());
      if (!found) return { ok: false, message: "That code isn't valid." };
      if (found.status !== "Active") return { ok: false, message: "This coupon has expired." };
      if (subtotal < found.minimum) return { ok: false, message: `Valid on orders above ₹${found.minimum.toLocaleString("en-IN")}.` };
      setCoupon(found.code);
      return { ok: true, message: `${found.code} applied.` };
    },
    [subtotal],
  );

  const placeOrder = useCallback(
    (customer: { name: string; email: string; address: string }) => {
      const order: Order = {
        id: "AE" + Math.floor(1100 + Math.random() * 800),
        customer: customer.name,
        email: customer.email,
        date: new Date().toISOString().slice(0, 10),
        total,
        status: "Confirmed",
        payment: "Paid",
        address: customer.address,
        items: cartProducts.map((l) => ({ name: l.product.name, qty: l.qty, price: l.product.price, image: l.product.images[0]! })),
      };
      setOrders((o) => [order, ...o]);
      setCart([]);
      setCoupon(null);
      return order;
    },
    [cartProducts, total],
  );

  const value: Store = {
    cart, wishlist, recent, coupon, orders, user,
    addToCart, setQty, removeFromCart, clearCart, toggleWishlist, markViewed,
    applyCoupon, clearCoupon: () => setCoupon(null), placeOrder,
    signIn: (name, email) => setUser({ name, email }),
    signOut: () => setUser(null),
    cartCount, subtotal, discount, shipping, total, cartProducts,
  };

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
