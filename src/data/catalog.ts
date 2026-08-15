import p1 from "@/assets/product-1.jpg";
import p2 from "@/assets/product-2.jpg";
import p3 from "@/assets/product-3.jpg";
import p4 from "@/assets/product-4.jpg";
import wedding from "@/assets/wedding.jpg";
import festive from "@/assets/festive.jpg";
import craft from "@/assets/craft.jpg";

export const IMAGES = { p1, p2, p3, p4, wedding, festive, craft };

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  mrp: number;
  category: string;
  collection: string;
  fabric: string;
  colour: string;
  occasion: string;
  rating: number;
  reviews: number;
  stock: number;
  badge?: string | undefined;
  images: string[];
  description: string;
  details: string[];
  createdAt: string;
};

const base = [p1, p2, p3, p4];

const seeds: Array<[string, number, number, string, string, string, string, string, number, number, string?]> = [
  ["Emerald Kanjeevaram Silk Saree", 24999, 32999, "Silk Sarees", "Wedding Edit", "Pure Kanjeevaram Silk", "Emerald", "Wedding", 4.9, 128, "Bestseller"],
  ["Blush Organza Zari Saree", 12499, 15999, "Organza", "New Arrivals", "Organza", "Blush", "Reception", 4.7, 64, "New"],
  ["Royal Blue Banarasi Brocade", 28999, 36999, "Banarasi", "Wedding Edit", "Katan Silk", "Royal Blue", "Wedding", 4.8, 92],
  ["Ivory Gold Tissue Saree", 21999, 26999, "Tissue", "Bridal Ivory", "Tissue Silk", "Ivory", "Engagement", 4.9, 71, "Limited"],
  ["Mysore Crepe Silk Saree", 9499, 11999, "Silk Sarees", "Everyday Luxe", "Mysore Crepe", "Rust", "Festive", 4.6, 41],
  ["Chanderi Handloom Saree", 8999, 10999, "Chanderi", "Everyday Luxe", "Chanderi Cotton Silk", "Sage", "Daywear", 4.5, 38],
  ["Maroon Zari Butta Banarasi", 26499, 31999, "Banarasi", "Festive Gold", "Katan Silk", "Maroon", "Festive", 4.8, 110, "Bestseller"],
  ["Pearl Grey Georgette Saree", 10999, 13999, "Georgette", "New Arrivals", "Georgette", "Grey", "Cocktail", 4.4, 29, "New"],
  ["Mustard Festive Silk Saree", 13999, 17999, "Silk Sarees", "Festive Gold", "Art Silk", "Mustard", "Festive", 4.6, 57],
  ["Bridal Red Kanjeevaram", 42999, 52999, "Silk Sarees", "Wedding Edit", "Pure Kanjeevaram Silk", "Red", "Bridal", 5.0, 164, "Signature"],
  ["Powder Pink Linen Saree", 7499, 8999, "Linen", "Everyday Luxe", "Handwoven Linen", "Pink", "Daywear", 4.3, 22],
  ["Antique Gold Tissue Drape", 23499, 28999, "Tissue", "Bridal Ivory", "Tissue Silk", "Gold", "Reception", 4.7, 48],
  ["Indigo Ajrakh Modal Saree", 8499, 10499, "Handloom", "Everyday Luxe", "Modal Silk", "Indigo", "Daywear", 4.5, 33],
  ["Wine Velvet Border Saree", 18999, 23999, "Silk Sarees", "Festive Gold", "Silk Velvet Border", "Wine", "Festive", 4.6, 44],
  ["Champagne Sequin Net Saree", 16999, 21999, "Georgette", "New Arrivals", "Net", "Champagne", "Cocktail", 4.4, 26, "New"],
  ["Peacock Green Paithani", 31999, 38999, "Paithani", "Wedding Edit", "Pure Paithani Silk", "Green", "Wedding", 4.9, 87, "Bestseller"],
];

export const PRODUCTS: Product[] = seeds.map((s, i) => {
  const [name, price, mrp, category, collection, fabric, colour, occasion, rating, reviews, badge] = s;
  return {
    id: `AE-${1001 + i}`,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    name,
    price,
    mrp,
    category,
    collection,
    fabric,
    colour,
    occasion,
    rating,
    reviews,
    stock: ([14, 6, 22, 3, 0, 11, 9, 17, 5, 2, 26, 8, 12, 7, 19, 4][i] ?? 10),
    badge,
    images: [base[i % 4]!, base[(i + 1) % 4]!, base[(i + 2) % 4]!, craft],
    description:
      "Woven by master artisans over several weeks, this drape balances heritage technique with a modern, restrained palette. Finished by hand and quality-checked in our Hyderabad atelier.",
    details: [
      `Fabric: ${fabric}`,
      `Colour: ${colour}`,
      "Length: 5.5m saree with 0.8m unstitched blouse piece",
      "Zari: Real gold-tested tested zari",
      "Care: Dry clean only",
    ],
    createdAt: new Date(2026, 6, 28 - i).toISOString(),
  };
});

export const CATEGORIES = [
  { name: "Silk Sarees", slug: "silk-sarees", image: p1, count: 5, blurb: "Kanjeevaram, Mysore & pure silks" },
  { name: "Banarasi", slug: "banarasi", image: p3, count: 2, blurb: "Katan silk with gold brocade" },
  { name: "Organza", slug: "organza", image: p2, count: 1, blurb: "Feather-light festive drapes" },
  { name: "Tissue", slug: "tissue", image: p4, count: 2, blurb: "Ivory & gold bridal tissue" },
  { name: "Handloom", slug: "handloom", image: craft, count: 2, blurb: "Slow-woven everyday luxury" },
  { name: "Paithani", slug: "paithani", image: p1, count: 1, blurb: "Maharashtrian heirlooms" },
];

export const COLLECTIONS = [
  { name: "Wedding Edit", slug: "wedding-edit", image: wedding, blurb: "For the seven vows and every ritual before them." },
  { name: "Festive Gold", slug: "festive-gold", image: festive, blurb: "Diwali, Sankranti and every lit-up evening." },
  { name: "Bridal Ivory", slug: "bridal-ivory", image: p4, blurb: "Ivory, champagne and antique gold." },
  { name: "New Arrivals", slug: "new-arrivals", image: p2, blurb: "This week at the atelier." },
  { name: "Everyday Luxe", slug: "everyday-luxe", image: p1, blurb: "Handloom drapes for real days." },
];

export const COUPONS = [
  { code: "ELITE10", type: "percent" as const, value: 10, minimum: 5000, uses: 214, status: "Active", expires: "2026-12-31" },
  { code: "FESTIVE1500", type: "flat" as const, value: 1500, minimum: 15000, uses: 88, status: "Active", expires: "2026-11-15" },
  { code: "WELCOME5", type: "percent" as const, value: 5, minimum: 0, uses: 640, status: "Active", expires: "2027-01-31" },
  { code: "MONSOON20", type: "percent" as const, value: 20, minimum: 20000, uses: 52, status: "Expired", expires: "2026-07-31" },
];

export type OrderStatus = "Confirmed" | "Processing" | "Shipped" | "Out for Delivery" | "Delivered" | "Cancelled";

export const ORDER_STAGES: OrderStatus[] = ["Confirmed", "Processing", "Shipped", "Out for Delivery", "Delivered"];

export type Order = {
  id: string;
  customer: string;
  email: string;
  date: string;
  total: number;
  status: OrderStatus;
  payment: "Paid" | "Pending" | "Refunded";
  items: { name: string; qty: number; price: number; image: string }[];
  address: string;
};

export const ORDERS: Order[] = [
  { id: "AE1024", customer: "Priya Sharma", email: "priya@example.com", date: "2026-08-14", total: 7999, status: "Confirmed", payment: "Paid", items: [{ name: "Powder Pink Linen Saree", qty: 1, price: 7499, image: p2 }], address: "Banjara Hills, Hyderabad 500034" },
  { id: "AE1023", customer: "Ananya Rao", email: "ananya@example.com", date: "2026-08-13", total: 24999, status: "Processing", payment: "Paid", items: [{ name: "Emerald Kanjeevaram Silk Saree", qty: 1, price: 24999, image: p1 }], address: "Indiranagar, Bengaluru 560038" },
  { id: "AE1022", customer: "Meera Iyer", email: "meera@example.com", date: "2026-08-11", total: 42999, status: "Shipped", payment: "Paid", items: [{ name: "Bridal Red Kanjeevaram", qty: 1, price: 42999, image: p4 }], address: "Adyar, Chennai 600020" },
  { id: "AE1021", customer: "Kavya Nair", email: "kavya@example.com", date: "2026-08-09", total: 21998, status: "Out for Delivery", payment: "Paid", items: [{ name: "Blush Organza Zari Saree", qty: 1, price: 12499, image: p2 }, { name: "Powder Pink Linen Saree", qty: 1, price: 7499, image: p1 }], address: "Kochi 682016" },
  { id: "AE1020", customer: "Divya Menon", email: "divya@example.com", date: "2026-08-05", total: 28999, status: "Delivered", payment: "Paid", items: [{ name: "Royal Blue Banarasi Brocade", qty: 1, price: 28999, image: p3 }], address: "Powai, Mumbai 400076" },
  { id: "AE1019", customer: "Sneha Gupta", email: "sneha@example.com", date: "2026-08-02", total: 13999, status: "Delivered", payment: "Refunded", items: [{ name: "Mustard Festive Silk Saree", qty: 1, price: 13999, image: p4 }], address: "Vasant Kunj, New Delhi 110070" },
];

export const CUSTOMERS = [
  { name: "Priya Sharma", email: "priya@example.com", city: "Hyderabad", orders: 7, spend: 128400, tier: "Elite", joined: "2024-03-11" },
  { name: "Ananya Rao", email: "ananya@example.com", city: "Bengaluru", orders: 4, spend: 74300, tier: "Gold", joined: "2024-11-02" },
  { name: "Meera Iyer", email: "meera@example.com", city: "Chennai", orders: 9, spend: 214900, tier: "Elite", joined: "2023-08-19" },
  { name: "Kavya Nair", email: "kavya@example.com", city: "Kochi", orders: 2, spend: 31200, tier: "Silver", joined: "2025-06-27" },
  { name: "Divya Menon", email: "divya@example.com", city: "Mumbai", orders: 5, spend: 96500, tier: "Gold", joined: "2025-01-14" },
  { name: "Sneha Gupta", email: "sneha@example.com", city: "New Delhi", orders: 1, spend: 13999, tier: "Silver", joined: "2026-02-08" },
];

export const REVIEWS = [
  { product: "Bridal Red Kanjeevaram", customer: "Meera Iyer", rating: 5, text: "Absolutely beautiful saree. The quality and packaging were beyond my expectations.", date: "2026-08-06", status: "Published" },
  { product: "Emerald Kanjeevaram Silk Saree", customer: "Ananya Rao", rating: 5, text: "The green is even richer in person. Zari work is flawless.", date: "2026-08-01", status: "Published" },
  { product: "Blush Organza Zari Saree", customer: "Kavya Nair", rating: 4, text: "Light, elegant and perfect for a reception. Draped beautifully.", date: "2026-07-24", status: "Published" },
  { product: "Royal Blue Banarasi Brocade", customer: "Divya Menon", rating: 5, text: "An heirloom piece. Worth every rupee.", date: "2026-07-18", status: "Pending" },
];

export const RETURNS = [
  { id: "RT-3041", order: "AE1019", customer: "Sneha Gupta", reason: "Colour differed from images", status: "Refunded", amount: 13999, date: "2026-08-04" },
  { id: "RT-3040", order: "AE1016", customer: "Riya Bose", reason: "Fall & pico requested", status: "In Review", amount: 9499, date: "2026-07-29" },
];

export const REVENUE_SERIES = [
  { month: "Feb", revenue: 412000, orders: 38 },
  { month: "Mar", revenue: 528000, orders: 47 },
  { month: "Apr", revenue: 486000, orders: 44 },
  { month: "May", revenue: 610000, orders: 55 },
  { month: "Jun", revenue: 742000, orders: 64 },
  { month: "Jul", revenue: 698000, orders: 61 },
  { month: "Aug", revenue: 884000, orders: 78 },
];

export const CATEGORY_SALES = [
  { name: "Silk Sarees", value: 42 },
  { name: "Banarasi", value: 24 },
  { name: "Tissue", value: 14 },
  { name: "Organza", value: 11 },
  { name: "Handloom", value: 9 },
];

export const TESTIMONIALS = [
  { name: "Meera Iyer", city: "Chennai", text: "Absolutely beautiful saree. The quality and packaging were beyond my expectations.", rating: 5 },
  { name: "Ananya Rao", city: "Bengaluru", text: "I wore the Kanjeevaram for my sister's wedding and three people asked where it was from.", rating: 5 },
  { name: "Priya Sharma", city: "Hyderabad", text: "Thoughtful service, honest fabric descriptions and a drape that actually looks like the photos.", rating: 5 },
];

export const FAQS = [
  { q: "Do you ship internationally?", a: "Yes. We ship to 24 countries with tracked, insured delivery in 5–9 business days." },
  { q: "Is the zari real gold?", a: "Our Signature and Wedding Edit pieces use tested half-fine zari. Each saree lists its zari grade on the product page." },
  { q: "Can I get fall and pico done?", a: "Yes, add the service at checkout. It adds 2 working days to dispatch." },
  { q: "What is your returns policy?", a: "7-day returns on unworn, untailored pieces. Bridal commissions are final sale." },
  { q: "Do you offer styling help?", a: "Our stylists are on WhatsApp daily 10am–8pm IST and can put together a full wedding look." },
];

export const findProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
