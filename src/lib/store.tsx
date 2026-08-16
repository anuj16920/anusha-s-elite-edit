import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { COUPONS, ORDERS, PRODUCTS, REVIEWS, type Order, type OrderStatus, type Product } from "@/data/catalog";

export type CartLine = { slug: string; qty: number };

export type Coupon = {
  code: string;
  type: "percent" | "flat";
  value: number;
  minimum: number;
  uses: number;
  status: string;
  expires: string;
};

export type Review = {
  product: string;
  customer: string;
  rating: number;
  text: string;
  date: string;
  status: string;
};

export type Message = { id: string; name: string; email: string; subject: string; text: string; date: string; read: boolean };

export type Settings = {
  storeName: string;
  supportEmail: string;
  phone: string;
  freeShippingAbove: number;
  shippingFee: number;
  currency: string;
};

const DEFAULT_SETTINGS: Settings = {
  storeName: "Anusha's Elite",
  supportEmail: "care@anushaselite.com",
  phone: "+91 98490 00000",
  freeShippingAbove: 5000,
  shippingFee: 199,
  currency: "INR",
};

type Store = {
  cart: CartLine[];
  wishlist: string[];
  recent: string[];
  coupon: string | null;
  orders: Order[];
  products: Product[];
  coupons: Coupon[];
  reviews: Review[];
  messages: Message[];
  settings: Settings;
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
  // admin
  setOrderStatus: (id: string, status: OrderStatus) => void;
  saveProduct: (p: Product) => void;
  deleteProduct: (slug: string) => void;
  setStock: (slug: string, stock: number) => void;
  saveCoupon: (c: Coupon) => void;
  toggleCouponStatus: (code: string) => void;
  deleteCoupon: (code: string) => void;
  addReview: (r: Omit<Review, "date" | "status"> & { status?: string }) => void;
  setReviewStatus: (index: number, status: string) => void;
  deleteReview: (index: number) => void;
  addMessage: (m: Omit<Message, "id" | "date" | "read">) => void;
  markMessageRead: (id: string) => void;
  saveSettings: (s: Settings) => void;
  resetDemoData: () => void;
  findProductBySlug: (slug: string) => Product | undefined;
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
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [coupons, setCoupons] = useState<Coupon[]>(COUPONS);
  const [reviews, setReviews] = useState<Review[]>(REVIEWS);
  const [messages, setMessages] = useState<Message[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    setCart(read<CartLine[]>("ae_cart", []));
    setWishlist(read<string[]>("ae_wishlist", []));
    setRecent(read<string[]>("ae_recent", []));
    setCoupon(read<string | null>("ae_coupon", null));
    setUser(read<{ name: string; email: string } | null>("ae_user", null));
    setOrders(read<Order[]>("ae_orders", ORDERS));
    setProducts(read<Product[]>("ae_products", PRODUCTS));
    setCoupons(read<Coupon[]>("ae_coupons", COUPONS));
    setReviews(read<Review[]>("ae_reviews", REVIEWS));
    setMessages(read<Message[]>("ae_messages", []));
    setSettings({ ...DEFAULT_SETTINGS, ...read<Partial<Settings>>("ae_settings", {}) });
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
    localStorage.setItem("ae_products", JSON.stringify(products));
    localStorage.setItem("ae_coupons", JSON.stringify(coupons));
    localStorage.setItem("ae_reviews", JSON.stringify(reviews));
    localStorage.setItem("ae_messages", JSON.stringify(messages));
    localStorage.setItem("ae_settings", JSON.stringify(settings));
  }, [hydrated, cart, wishlist, recent, coupon, user, orders, products, coupons, reviews, messages, settings]);

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
        .map((l) => ({ product: products.find((p) => p.slug === l.slug)!, qty: l.qty }))
        .filter((l) => Boolean(l.product)),
    [cart, products],
  );

  const subtotal = cartProducts.reduce((s, l) => s + l.product.price * l.qty, 0);
  const activeCoupon = coupons.find((c) => c.code === coupon && c.status === "Active");
  const discount = activeCoupon
    ? activeCoupon.type === "percent"
      ? Math.round((subtotal * activeCoupon.value) / 100)
      : activeCoupon.value
    : 0;
  const shipping = subtotal > 0 && subtotal - discount < settings.freeShippingAbove ? settings.shippingFee : 0;
  const total = Math.max(0, subtotal - discount + shipping);
  const cartCount = cart.reduce((s, l) => s + l.qty, 0);

  const applyCoupon = useCallback(
    (code: string) => {
      const found = coupons.find((c) => c.code.toLowerCase() === code.trim().toLowerCase());
      if (!found) return { ok: false, message: "That code isn't valid." };
      if (found.status !== "Active") return { ok: false, message: "This coupon has expired." };
      if (subtotal < found.minimum) return { ok: false, message: `Valid on orders above ₹${found.minimum.toLocaleString("en-IN")}.` };
      setCoupon(found.code);
      return { ok: true, message: `${found.code} applied.` };
    },
    [subtotal, coupons],
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
      // decrement stock
      setProducts((ps) =>
        ps.map((p) => {
          const line = cartProducts.find((l) => l.product.slug === p.slug);
          return line ? { ...p, stock: Math.max(0, p.stock - line.qty) } : p;
        }),
      );
      if (coupon) setCoupons((cs) => cs.map((c) => (c.code === coupon ? { ...c, uses: c.uses + 1 } : c)));
      setCart([]);
      setCoupon(null);
      return order;
    },
    [cartProducts, total, coupon],
  );

  const value: Store = {
    cart, wishlist, recent, coupon, orders, products, coupons, reviews, messages, settings, user,
    addToCart, setQty, removeFromCart, clearCart, toggleWishlist, markViewed,
    applyCoupon, clearCoupon: () => setCoupon(null), placeOrder,
    signIn: (name, email) => setUser({ name, email }),
    signOut: () => setUser(null),
    setOrderStatus: (id, status) => setOrders((o) => o.map((x) => (x.id === id ? { ...x, status } : x))),
    saveProduct: (p) => setProducts((ps) => (ps.some((x) => x.slug === p.slug) ? ps.map((x) => (x.slug === p.slug ? p : x)) : [p, ...ps])),
    deleteProduct: (slug) => setProducts((ps) => ps.filter((p) => p.slug !== slug)),
    setStock: (slug, stock) => setProducts((ps) => ps.map((p) => (p.slug === slug ? { ...p, stock: Math.max(0, stock) } : p))),
    saveCoupon: (c) => setCoupons((cs) => (cs.some((x) => x.code === c.code) ? cs.map((x) => (x.code === c.code ? c : x)) : [c, ...cs])),
    toggleCouponStatus: (code) => setCoupons((cs) => cs.map((c) => (c.code === code ? { ...c, status: c.status === "Active" ? "Expired" : "Active" } : c))),
    deleteCoupon: (code) => setCoupons((cs) => cs.filter((c) => c.code !== code)),
    addReview: (r) => setReviews((rs) => [{ ...r, date: new Date().toISOString().slice(0, 10), status: r.status ?? "Pending" }, ...rs]),
    setReviewStatus: (index, status) => setReviews((rs) => rs.map((r, i) => (i === index ? { ...r, status } : r))),
    deleteReview: (index) => setReviews((rs) => rs.filter((_, i) => i !== index)),
    addMessage: (m) =>
      setMessages((ms) => [{ ...m, id: "MSG-" + Math.floor(1000 + Math.random() * 9000), date: new Date().toISOString().slice(0, 10), read: false }, ...ms]),
    markMessageRead: (id) => setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, read: true } : m))),
    saveSettings: (s) => setSettings(s),
    resetDemoData: () => {
      setProducts(PRODUCTS); setOrders(ORDERS); setCoupons(COUPONS); setReviews(REVIEWS); setMessages([]); setSettings(DEFAULT_SETTINGS); setCart([]); setCoupon(null);
    },
    findProductBySlug: (slug) => products.find((p) => p.slug === slug),
    cartCount, subtotal, discount, shipping, total, cartProducts,
  };

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
