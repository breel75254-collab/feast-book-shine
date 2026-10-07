import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { categories, listings, type Category } from "../lib/listings";

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

const steps = [
  { n: "1", title: "Post in a minute", text: "A short form — title, price, location, phone. Or send by SMS, WhatsApp or USSD." },
  { n: "2", title: "We review it", text: "Every ad is checked to keep scams out. Verified posters get a badge." },
  { n: "3", title: "Buyers call you", text: "Every ad has click-to-call and WhatsApp. No accounts, no CVs, no fuss." },
];

function Index() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "All">("All");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return listings.filter((l) => {
      if (category !== "All" && l.category !== category) return false;
      if (!q) return true;
      return [l.title, l.location, l.description, l.price]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [query, category]);

  return (
    <div>
      {/* Hero + search */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
            Kenya's simple classifieds
          </p>
          <h1 className="mt-3 text-balance text-4xl font-bold leading-tight sm:text-5xl">
            Rentals, jobs & car hire — near you
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Fast pages that load on any phone and any network. Post free, pay with
            M-Pesa if you want a boost, and deal directly by phone or WhatsApp.
          </p>
          <div className="mx-auto mt-8 flex max-w-xl gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search e.g. bedsitter Maseno, driver, pickup…"
              className="w-full rounded-full border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Search listings"
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
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Listings */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {category === "All" ? "Latest ads" : category}{" "}
            <span className="text-base font-normal text-muted-foreground">
              ({results.length})
            </span>
          </h2>
          <Link
            to="/post"
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Post an ad
          </Link>
        </div>

        {results.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-input bg-card p-10 text-center text-muted-foreground">
            No ads match your search. Try different words — or{" "}
            <Link to="/post" className="text-primary hover:underline">
              post the first one
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
                    {l.category}
                  </span>
                  {l.verified && (
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <h3 className="mt-3 text-lg font-semibold leading-snug">{l.title}</h3>
                <p className="mt-1 text-sm font-semibold text-primary">{l.price}</p>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {l.description}
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  📍 {l.location} · Ad {l.id} · {l.posted}
                </p>
                <div className="mt-4 flex gap-2">
                  <a
                    href={`tel:+254${l.phone.replace(/\s/g, "").slice(1)}`}
                    className="flex-1 rounded-full bg-primary px-3 py-2 text-center text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    Call
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
          <h2 className="text-center text-3xl font-bold">What are you looking for?</h2>
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
                <h3 className="mt-3 text-xl font-semibold">{c.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{c.blurb}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold">How it works</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {steps.map((s) => (
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
          No smartphone? No problem. Post and browse by SMS (40777), WhatsApp, or
          USSD *384*77# — and community agents at local shops and cyber cafés can
          post for you.
        </p>
      </section>
    </div>
  );
}
