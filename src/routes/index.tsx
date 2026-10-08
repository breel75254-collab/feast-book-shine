import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { categories, listings, type Category, type Listing } from "../lib/listings";
import { supabase } from "@/integrations/supabase/client";
import { useLang, categoryLabel, categoryBlurb } from "../lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tangaza.ke — Rentals, Jobs & Car Hire in Rural Kenya" },
      {
        name: "description",
        content:
          "Find rentals, jobs and car hire near you. Fast pages that work on any phone, cheap ads from free, verified listings you can trust.",
      },
      { property: "og:title", content: "Tangaza.ke — Rentals, Jobs & Car Hire in Rural Kenya" },
      {
        property: "og:description",
        content: "Fast, cheap, verified classifieds for rural Kenya. Browse or post in under a minute.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { t } = useLang();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "All">("All");
  const [liveAds, setLiveAds] = useState<Listing[]>([]);

  useEffect(() => {
    supabase
      .from("ads")
      .select("code,title,category,price,location,phone,description,verified,plan,approved_at,created_at")
      .eq("status", "approved")
      .order("approved_at", { ascending: false })
      .limit(100)
      .then(({ data }) => {
        if (!data) return;
        const sorted = [...data].sort(
          (a, b) => Number(b.plan === "featured") - Number(a.plan === "featured"),
        );
        setLiveAds(
          sorted.map((a) => ({
            id: a.code,
            title: a.title,
            category: a.category as Category,
            price: a.price,
            location: a.location,
            phone: a.phone,
            description: a.description,
            verified: a.verified,
            posted: new Date(a.approved_at ?? a.created_at).toLocaleDateString(),
          })),
        );
      });
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...liveAds, ...listings].filter((l) => {
      if (category !== "All" && l.category !== category) return false;
      if (!q) return true;
      return [l.title, l.location, l.description, l.price]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [query, category, liveAds]);

  return (
    <div>
      {/* Hero + search */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
            {t("heroKicker")}
          </p>
          <h1 className="mt-3 text-balance text-4xl font-bold leading-tight sm:text-5xl">
            {t("heroTitle")}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{t("heroSub")}</p>
          <div className="mx-auto mt-8 flex max-w-xl gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full rounded-full border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label={t("searchLabel")}
            />
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {(["All", ...categories.map((c) => c.name)] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={
                  category === c
                    ? "rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground"
                    : "rounded-full border border-input bg-background px-4 py-1.5 text-sm font-medium text-muted-foreground hover:bg-secondary"
                }
              >
                {c === "All" ? t("all") : categoryLabel(c, t)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Listings */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {category === "All" ? t("latestAds") : categoryLabel(category, t)}{" "}
            <span className="text-base font-normal text-muted-foreground">
              ({results.length})
            </span>
          </h2>
          <Link
            to="/post"
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            {t("postAd")}
          </Link>
        </div>

        {results.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-input bg-card p-10 text-center text-muted-foreground">
            {t("noResults")}{" "}
            <Link to="/post" className="text-primary hover:underline">
              {t("postFirst")}
            </Link>
            .
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((l) => (
              <article
                key={l.id}
                className="flex flex-col rounded-2xl border border-border bg-card p-5"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                    {categoryLabel(l.category, t)}
                  </span>
                  {l.verified && (
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                      {t("verified")}
                    </span>
                  )}
                </div>
                <h3 className="mt-3 text-lg font-semibold leading-snug">{l.title}</h3>
                <p className="mt-1 text-sm font-semibold text-primary">{l.price}</p>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {l.description}
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  📍 {l.location} · {t("ad")} {l.id} · {l.posted}
                </p>
                <div className="mt-4 flex gap-2">
                  <a
                    href={`tel:+254${l.phone.replace(/\s/g, "").slice(1)}`}
                    className="flex-1 rounded-full bg-primary px-3 py-2 text-center text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    {t("call")}
                  </a>
                  <a
                    href={`https://wa.me/254${l.phone.replace(/\s/g, "").slice(1)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 rounded-full border border-input px-3 py-2 text-center text-sm font-semibold hover:bg-secondary"
                  >
                    WhatsApp
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center text-3xl font-bold">{t("lookingFor")}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {categories.map((c) => (
              <button
                key={c.name}
                onClick={() => {
                  setCategory(c.name);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="rounded-2xl border border-border bg-background p-6 text-left transition-colors hover:border-primary"
              >
                <span className="text-3xl">{c.icon}</span>
                <h3 className="mt-3 text-xl font-semibold">{categoryLabel(c.name, t)}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{categoryBlurb(c.name, t)}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold">{t("howItWorks")}</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { n: "1", title: t("step1Title"), text: t("step1Text") },
            { n: "2", title: t("step2Title"), text: t("step2Text") },
            { n: "3", title: t("step3Title"), text: t("step3Text") },
          ].map((s) => (
            <div key={s.n} className="rounded-2xl border border-border bg-card p-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-display text-lg font-bold text-primary-foreground">
                {s.n}
              </span>
              <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-muted-foreground">
          {t("noSmartphone")}
        </p>
      </section>
    </div>
  );
}
