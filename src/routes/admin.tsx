import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { motion } from "motion/react";
import { LayoutDashboard, Package, ShoppingCart, Users, Boxes, Ticket, Star, Settings, Menu } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Business Portal — Anusha's Elite" },
      { name: "description", content: "Revenue, orders, inventory, customers and content for Anusha's Elite." },
      { property: "og:title", content: "Business Portal — Anusha's Elite" },
      { property: "og:description", content: "Operations dashboard for the house." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/inventory", label: "Inventory", icon: Boxes },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/coupons", label: "Coupons", icon: Ticket },
  { to: "/admin/reviews", label: "Reviews", icon: Star },
  { to: "/admin/settings", label: "Settings", icon: Settings },
] as const;

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  const Sidebar = (
    <nav className="flex h-full flex-col gap-1 border-r border-sidebar-border bg-sidebar p-4">
      <Link to="/" className="mb-6 block px-2">
        <span className="font-display text-lg tracking-[0.24em]">ANUSHA&apos;S ELITE</span>
        <span className="mt-0.5 block text-[8px] tracking-[0.34em] text-gold">BUSINESS PORTAL</span>
      </Link>
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link key={to} to={to} onClick={() => setOpen(false)} className={cn("relative flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors", active ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
            {active && <motion.span layoutId="adminActive" className="absolute inset-0 rounded-sm bg-sidebar-accent" transition={{ type: "spring", stiffness: 320, damping: 30 }} />}
            <Icon className={cn("relative h-4 w-4 transition-transform", active && "translate-x-0.5 text-gold")} />
            <span className="relative">{label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="hidden lg:block">{Sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-charcoal/40" onClick={() => setOpen(false)} />
          <motion.div initial={{ x: -260 }} animate={{ x: 0 }} className="absolute left-0 top-0 h-full w-64">{Sidebar}</motion.div>
        </div>
      )}
      <div className="min-w-0">
        <header className="flex items-center gap-3 border-b border-border px-5 py-4 lg:hidden">
          <button onClick={() => setOpen(true)} aria-label="Open menu"><Menu className="h-5 w-5" /></button>
          <span className="font-display text-lg tracking-[0.2em]">BUSINESS PORTAL</span>
        </header>
        <div className="p-5 sm:p-8">
          <Outlet />
        </div>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}
