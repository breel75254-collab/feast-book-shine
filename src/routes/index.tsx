import { createFileRoute, Link } from "@tanstack/react-router";
import heroImage from "../assets/hero.jpg";
import foodImage from "../assets/food.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ujamaa Bar & Restaurant — Good Food, Cold Beer, Great Vibes in Maseno" },
      {
        name: "description",
        content:
          "Ujamaa Bar & Restaurant, opposite Maseno University. Nyama choma, ice-cold beer, lunch and dinner. Dine-in, takeaway and table bookings.",
      },
      { property: "og:title", content: "Ujamaa Bar & Restaurant — Maseno" },
      {
        property: "og:description",
        content:
          "Good food, cold beer, great vibes — opposite Maseno University. Book a table online.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const highlights = [
  {
    title: "Great beer selection",
    text: "Ice-cold Tusker, White Cap, spirits and wine — always served right.",
  },
  {
    title: "Lunch & dinner",
    text: "Nyama choma, ugali, kachumbari and quick bites, with full table service.",
  },
  {
    title: "Made for groups",
    text: "A casual, relaxed spot for friends, colleagues and celebrations.",
  },
];

function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden">
        <img
          src={heroImage}
          alt="Inside Ujamaa Bar & Restaurant at dusk"
          className="absolute inset-0 h-full w-full object-cover"
          width={1920}
          height={1088}
        />
        <div className="absolute inset-0 bg-background/70" />
        <div className="relative mx-auto max-w-3xl px-4 py-24 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            Opposite Maseno University
          </p>
          <h1 className="mt-4 text-balance text-5xl font-bold leading-tight sm:text-6xl">
            Good food. Cold beer. Great vibes.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Ujamaa Bar & Restaurant is Maseno's relaxed spot for lunch, dinner and
            evening drinks — dine in or take away.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/booking"
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Book a table
            </Link>
            <a
              href="tel:+254771324567"
              className="rounded-full border border-input px-6 py-3 text-sm font-semibold transition-colors hover:bg-secondary"
            >
              Call 0771 324 567
            </a>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">Open daily from 5:00 pm · Dine-in · Takeaway</p>
        </div>
      </section>

      {/* Highlights */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-6 sm:grid-cols-3">
          {highlights.map((h) => (
            <div key={h.title} className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-xl font-semibold text-primary">{h.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{h.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Food & drink */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 md:grid-cols-2">
          <img
            src={foodImage}
            alt="Nyama choma platter with ugali and kachumbari"
            className="w-full rounded-2xl object-cover"
            loading="lazy"
            width={1024}
            height={1024}
          />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
              Food & drink
            </p>
            <h2 className="mt-3 text-4xl font-bold">From the grill to your table</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Whether you're after a proper lunch, a quick bite or small plates with
              your drink, our kitchen has you covered. Pair it with a cold beer, a
              glass of wine or your favourite spirit from the bar.
            </p>
            <ul className="mt-6 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <li>· Nyama choma & grills</li>
              <li>· Ugali & kachumbari</li>
              <li>· Quick bites & small plates</li>
              <li>· Beer, wine & spirits</li>
              <li>· Bar on site</li>
              <li>· Free parking</li>
            </ul>
            <Link
              to="/booking"
              className="mt-8 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Reserve your table
            </Link>
          </div>
        </div>
      </section>

      {/* Visit us */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
              Visit us
            </p>
            <h2 className="mt-3 text-4xl font-bold">Find us in Maseno</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              We're on the Maseno–Kisumu Road, directly opposite Maseno University —
              easy to reach, with free parking on site and on the street.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="font-semibold text-foreground">Address</dt>
                <dd className="mt-1 text-muted-foreground">
                  Off Maseno–Kisumu Road, opposite Maseno University, Maseno
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-foreground">Hours</dt>
                <dd className="mt-1 text-muted-foreground">Open daily from 5:00 pm</dd>
              </div>
              <div>
                <dt className="font-semibold text-foreground">Phone</dt>
                <dd className="mt-1 text-muted-foreground">
                  <a href="tel:+254771324567" className="hover:text-foreground">
                    0771 324 567
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
}
