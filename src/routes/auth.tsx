import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { GoldDivider, Reveal } from "@/components/motion-kit";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — Anusha's Elite" },
      { name: "description", content: "Sign in to track orders, manage addresses and revisit your saved collection." },
      { property: "og:title", content: "Sign In — Anusha's Elite" },
      { property: "og:description", content: "Access your Anusha's Elite account." },
    ],
  }),
  component: Auth,
});

function Auth() {
  const { signIn } = useStore();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("Priya Sharma");
  const [email, setEmail] = useState("priya@example.com");

  return (
    <div className="mx-auto max-w-md px-5 py-20 sm:px-8">
      <Reveal className="text-center">
        <p className="eyebrow">{mode === "in" ? "Welcome back" : "Join the house"}</p>
        <h1 className="mt-3 font-display text-4xl">{mode === "in" ? "Sign in" : "Create account"}</h1>
        <GoldDivider className="mt-4" />
      </Reveal>

      <form
        className="mt-10 space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          signIn(name, email);
          toast.success(`Welcome, ${name.split(" ")[0]}`);
          navigate({ to: "/account" });
        }}
      >
        {mode === "up" && (
          <label className="block">
            <span className="eyebrow">Full name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} required className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold" />
          </label>
        )}
        <label className="block">
          <span className="eyebrow">Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold" />
        </label>
        <label className="block">
          <span className="eyebrow">Password</span>
          <input type="password" defaultValue="demo1234" required className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold" />
        </label>
        <button className="btn-shine w-full bg-charcoal py-4 text-[11px] tracking-[0.24em] text-ivory transition-colors hover:bg-maroon">
          {mode === "in" ? "SIGN IN" : "CREATE ACCOUNT"}
        </button>
      </form>

      <button onClick={() => setMode(mode === "in" ? "up" : "in")} className="link-underline mx-auto mt-6 block text-[11px] tracking-[0.2em] text-muted-foreground">
        {mode === "in" ? "NEW HERE? CREATE AN ACCOUNT" : "ALREADY HAVE AN ACCOUNT? SIGN IN"}
      </button>
    </div>
  );
}
