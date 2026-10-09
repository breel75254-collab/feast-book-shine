import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Review ads & payments | Tangaza Africa" },
      { name: "description", content: "Approve or reject ads and confirm M-Pesa payments." },
      { property: "og:title", content: "Admin — Tangaza Africa" },
      { property: "og:description", content: "Approve ads and confirm payments." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Ad = Tables<"ads">;
type Tab = "pending" | "approved" | "rejected";

const planLabel: Record<string, string> = {
  free: "Free · 7 days",
  extended: "Extended · KES 50",
  featured: "Featured · KES 300",
};

function AdminPage() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>("pending");
  const [ads, setAds] = useState<Ad[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return setIsAdmin(false);
      const { data: ok } = await supabase.rpc("has_role", { _user_id: data.user.id, _role: "admin" });
      setIsAdmin(!!ok);
    });
  }, []);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("ads")
      .select("*")
      .eq("status", tab)
      .order("created_at", { ascending: false });
    setAds(data ?? []);
  }, [tab]);

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, load]);

  async function update(id: string, changes: Partial<Ad>) {
    setBusyId(id);
    const { data, error } = await supabase.from("ads").update(changes).eq("id", id).select("id");
    setBusyId(null);
    if (error || !data?.length) {
      window.alert(
        "This change was not saved. Please sign out, sign in again and retry." +
          (error ? `\n\n(${error.message})` : ""),
      );
    }
    load();
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (isAdmin === null) return <p className="p-10 text-center text-muted-foreground">Loading…</p>;
  if (!isAdmin)
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Not an admin</h1>
        <p className="mt-2 text-muted-foreground">This account can't review ads.</p>
        <button onClick={signOut} className="mt-6 rounded-full border border-input px-5 py-2 text-sm">Sign out</button>
      </div>
    );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Review ads</h1>
        <button onClick={signOut} className="rounded-full border border-input px-4 py-2 text-sm hover:bg-secondary">Sign out</button>
      </div>
      <div className="mt-6 flex gap-2">
        {(["pending", "approved", "rejected"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={
              tab === t
                ? "rounded-full bg-primary px-4 py-1.5 text-sm font-medium capitalize text-primary-foreground"
                : "rounded-full border border-input px-4 py-1.5 text-sm capitalize text-muted-foreground hover:bg-secondary"
            }
          >
            {t}
          </button>
        ))}
      </div>

      {ads.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-input bg-card p-10 text-center text-muted-foreground">
          Nothing here.
        </p>
      ) : (
        <div className="mt-6 grid gap-4">
          {ads.map((a) => {
            const needsPayment = a.plan !== "free";
            const paid = a.payment_status === "paid";
            return (
              <article key={a.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {a.code} · {a.category} · {new Date(a.created_at).toLocaleString()}
                    </p>
                    <h2 className="mt-1 text-lg font-semibold">{a.title}</h2>
                    <p className="text-sm font-semibold text-primary">{a.price}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs font-semibold">
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-secondary-foreground">{planLabel[a.plan]}</span>
                    {needsPayment && (
                      <span className={paid ? "rounded-full bg-primary/10 px-2.5 py-1 text-primary" : "rounded-full bg-destructive/10 px-2.5 py-1 text-destructive"}>
                        {paid ? "Payment received" : "Payment not confirmed"}
                      </span>
                    )}
                    {a.verified && <span className="rounded-full bg-primary/10 px-2.5 py-1 text-primary">✓ Verified</span>}
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{a.description}</p>
                <p className="mt-2 text-sm">📍 {a.location} · 📞 <a className="text-primary" href={`tel:${a.phone}`}>{a.phone}</a></p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {needsPayment && !paid && (
                    <button disabled={busyId === a.id} onClick={() => update(a.id, { payment_status: "paid" })} className="rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5">
                      Mark payment received
                    </button>
                  )}
                  {tab !== "approved" && (
                    <button
                      disabled={busyId === a.id || (needsPayment && !paid)}
                      title={needsPayment && !paid ? "Confirm payment first" : undefined}
                      onClick={() => update(a.id, { status: "approved", approved_at: new Date().toISOString() })}
                      className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                    >
                      Approve & publish
                    </button>
                  )}
                  <button disabled={busyId === a.id} onClick={() => update(a.id, { verified: !a.verified })} className="rounded-full border border-input px-4 py-2 text-sm hover:bg-secondary">
                    {a.verified ? "Remove verified badge" : "Give verified badge"}
                  </button>
                  {tab !== "rejected" && (
                    <button disabled={busyId === a.id} onClick={() => update(a.id, { status: "rejected" })} className="rounded-full border border-destructive px-4 py-2 text-sm text-destructive hover:bg-destructive/5">
                      {tab === "approved" ? "Take down" : "Reject"}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
