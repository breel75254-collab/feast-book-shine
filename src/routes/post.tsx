import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { categories } from "../lib/listings";

export const Route = createFileRoute("/post")({
  head: () => ({
    meta: [
      { title: "Post an Ad — Tangaza.ke" },
      {
        name: "description",
        content:
          "Post a rental, job or car-hire ad in under a minute. Free listings for 7 days, M-Pesa boosts from KES 50.",
      },
      { property: "og:title", content: "Post an Ad — Tangaza.ke" },
      {
        property: "og:description",
        content: "Post a rental, job or car-hire ad in under a minute. Free for 7 days.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PostPage,
});

const inputClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

function PostPage() {
  const [submitted, setSubmitted] = useState(false);
  const [adCode, setAdCode] = useState("");
  const [form, setForm] = useState({
    title: "",
    category: categories[0]?.name ?? "Rentals",
    price: "",
    location: "",
    phone: "",
    description: "",
    boost: "free",
  });

  function update(field: keyof typeof form) {
    return (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    ) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const prefix = form.category === "Rentals" ? "RN" : form.category === "Jobs" ? "JB" : "CH";
    setAdCode(`${prefix}${Math.floor(1000 + Math.random() * 9000)}`);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="rounded-2xl border border-border bg-card p-10">
          <p className="text-4xl">✅</p>
          <h1 className="mt-4 text-3xl font-bold">Ad received!</h1>
          <p className="mt-3 text-muted-foreground">
            Your ad <strong className="text-foreground">“{form.title}”</strong> is now
            in review. Once approved it goes live — usually within the hour.
          </p>
          <div className="mt-6 rounded-xl bg-secondary p-4">
            <p className="text-sm text-secondary-foreground">Your ad code — keep it safe:</p>
            <p className="mt-1 font-display text-2xl font-bold tracking-widest">{adCode}</p>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Use this code to edit, renew or delete your ad later — e.g. send{" "}
            <span className="font-mono text-foreground">EDIT {adCode} price 8000</span>{" "}
            by SMS to 40777.
          </p>
          {form.boost !== "free" && (
            <p className="mt-4 text-sm text-muted-foreground">
              You'll receive an M-Pesa prompt on{" "}
              <strong className="text-foreground">{form.phone}</strong> to complete
              your {form.boost === "featured" ? "KES 300 featured" : "KES 50 extended"}{" "}
              payment.
            </p>
          )}
          <button
            onClick={() => setSubmitted(false)}
            className="mt-8 rounded-full border border-input px-6 py-3 text-sm font-semibold hover:bg-secondary"
          >
            Post another ad
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
            Post an ad
          </p>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Reach buyers near you</h1>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            One short form — no accounts, no CV uploads. Your ad is reviewed, then
            goes live with click-to-call and WhatsApp buttons.
          </p>
          <div className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-6 text-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold">Free</p>
                <p className="text-muted-foreground">Live for 7 days</p>
              </div>
              <p className="font-semibold text-primary">KES 0</p>
            </div>
            <div className="flex items-start justify-between gap-4 border-t border-border pt-4">
              <div>
                <p className="font-semibold">Extended</p>
                <p className="text-muted-foreground">Live for 30 days</p>
              </div>
              <p className="font-semibold text-primary">KES 50</p>
            </div>
            <div className="flex items-start justify-between gap-4 border-t border-border pt-4">
              <div>
                <p className="font-semibold">Featured</p>
                <p className="text-muted-foreground">Top of the list for 30 days + verified check</p>
              </div>
              <p className="font-semibold text-primary">KES 300</p>
            </div>
            <p className="border-t border-border pt-4 text-muted-foreground">
              Paid options are completed with an M-Pesa prompt on your phone — no
              cards, no sign-up.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="grid gap-5">
            <div>
              <label htmlFor="title" className="mb-1.5 block text-sm font-medium">
                Ad title
              </label>
              <input
                id="title"
                required
                value={form.title}
                onChange={update("title")}
                placeholder="e.g. Bedsitter near Maseno University"
                className={inputClass}
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="category" className="mb-1.5 block text-sm font-medium">
                  Category
                </label>
                <select id="category" value={form.category} onChange={update("category")} className={inputClass}>
                  {categories.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="price" className="mb-1.5 block text-sm font-medium">
                  Price
                </label>
                <input
                  id="price"
                  required
                  value={form.price}
                  onChange={update("price")}
                  placeholder="e.g. KES 6,500 / month"
                  className={inputClass}
                />
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="location" className="mb-1.5 block text-sm font-medium">
                  Location
                </label>
                <input
                  id="location"
                  required
                  value={form.location}
                  onChange={update("location")}
                  placeholder="e.g. Maseno, Kisumu County"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">
                  Your phone number
                </label>
                <input
                  id="phone"
                  required
                  type="tel"
                  value={form.phone}
                  onChange={update("phone")}
                  placeholder="e.g. 0712 345 678"
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label htmlFor="description" className="mb-1.5 block text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                required
                rows={4}
                value={form.description}
                onChange={update("description")}
                placeholder="What are you offering? Condition, terms, what's included…"
                className={inputClass}
              />
            </div>
            <fieldset>
              <legend className="mb-1.5 text-sm font-medium">Listing plan</legend>
              <div className="grid gap-2 sm:grid-cols-3">
                {[
                  { value: "free", label: "Free · 7 days" },
                  { value: "extended", label: "KES 50 · 30 days" },
                  { value: "featured", label: "KES 300 · Featured" },
                ].map((p) => (
                  <label
                    key={p.value}
                    className={
                      form.boost === p.value
                        ? "cursor-pointer rounded-lg border-2 border-primary bg-primary/5 px-3 py-2.5 text-center text-sm font-medium"
                        : "cursor-pointer rounded-lg border border-input px-3 py-2.5 text-center text-sm text-muted-foreground hover:bg-secondary"
                    }
                  >
                    <input
                      type="radio"
                      name="boost"
                      value={p.value}
                      checked={form.boost === p.value}
                      onChange={update("boost")}
                      className="sr-only"
                    />
                    {p.label}
                  </label>
                ))}
              </div>
            </fieldset>
            <button
              type="submit"
              className="mt-2 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Submit for review
            </button>
            <p className="text-center text-xs text-muted-foreground">
              By posting you agree to our terms. Scams and fake listings are removed
              and reported.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
