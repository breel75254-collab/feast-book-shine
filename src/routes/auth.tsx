import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin sign in — Tangaza Africa" },
      { name: "description", content: "Sign in to review and approve ads on Tangaza Africa." },
      { property: "og:title", content: "Admin sign in — Tangaza Africa" },
      { property: "og:description", content: "Sign in to review and approve ads." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const inputClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return setMsg(error.message);
      navigate({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      setBusy(false);
      if (error) return setMsg(error.message);
      setMsg("Check your email to confirm your account, then sign in.");
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-20">
      <div className="rounded-2xl border border-border bg-card p-8">
        <h1 className="text-2xl font-bold">{mode === "in" ? "Admin sign in" : "Create admin account"}</h1>
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          <input type="password" required minLength={8} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
          <button disabled={busy} className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
            {mode === "in" ? "Sign in" : "Create account"}
          </button>
          {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
        </form>
        <button onClick={() => setMode(mode === "in" ? "up" : "in")} className="mt-4 text-sm text-primary hover:underline">
          {mode === "in" ? "First time? Create the admin account" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
