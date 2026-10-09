import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { categories } from "../lib/listings";
import { useLang, categoryLabel } from "../lib/i18n";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/post")({
  head: () => ({
    meta: [
      { title: "Post an Ad — Tangaza Africa" },
      {
        name: "description",
        content:
          "Post a rental, job or car-hire ad in under a minute. Free listings for 7 days, M-Pesa boosts from KES 50.",
      },
      { property: "og:title", content: "Post an Ad — Tangaza Africa" },
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
  const { t } = useLang();
  const [submitted, setSubmitted] = useState(false);
  const [adCode, setAdCode] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSending(true);
    const prefix = form.category === "Rentals" ? "RN" : form.category === "Jobs" ? "JB" : "CH";
    const code = `${prefix}${Math.floor(100000 + Math.random() * 900000)}`;
    const { error: err } = await supabase.from("ads").insert({
      code,
      title: form.title.trim(),
      category: form.category,
      price: form.price.trim(),
      location: form.location.trim(),
      phone: form.phone.trim(),
      description: form.description.trim(),
      plan: form.boost,
      payment_status: form.boost === "free" ? "none" : "pending",
    });
    setSending(false);
    if (err) {
      setError("Could not send your ad. Please check the details and try again.");
      return;
    }
    setAdCode(code);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="rounded-2xl border border-border bg-card p-10">
          <p className="text-4xl">✅</p>
          <h1 className="mt-4 text-3xl font-bold">{t("adReceived")}</h1>
          <p className="mt-3 text-muted-foreground">
            <strong className="text-foreground">“{form.title}”</strong> {t("inReview")}
          </p>
          <div className="mt-6 rounded-xl bg-secondary p-4">
            <p className="text-sm text-secondary-foreground">{t("yourAdCode")}</p>
            <p className="mt-1 font-display text-2xl font-bold tracking-widest">{adCode}</p>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {t("codeUsage")}{" "}
            <span className="font-mono text-foreground">EDIT {adCode} price 8000</span>{" "}
            {t("bySms")}
          </p>
          {form.boost !== "free" && (
            <p className="mt-4 text-sm text-muted-foreground">
              {t("mpesaPrompt")}{" "}
              <strong className="text-foreground">{form.phone}</strong> {t("toComplete")}{" "}
              {form.boost === "featured" ? t("featuredPayment") : t("extendedPayment")}{" "}
              {t("payment")}
            </p>
          )}
          <button
            onClick={() => setSubmitted(false)}
            className="mt-8 rounded-full border border-input px-6 py-3 text-sm font-semibold hover:bg-secondary"
          >
            {t("postAnother")}
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
            {t("postKicker")}
          </p>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">{t("postTitle")}</h1>
          <p className="mt-4 leading-relaxed text-muted-foreground">{t("postSub")}</p>
          <div className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-6 text-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold">{t("planFree")}</p>
                <p className="text-muted-foreground">{t("planFreeDesc")}</p>
              </div>
              <p className="font-semibold text-primary">KES 0</p>
            </div>
            <div className="flex items-start justify-between gap-4 border-t border-border pt-4">
              <div>
                <p className="font-semibold">{t("planExtended")}</p>
                <p className="text-muted-foreground">{t("planExtendedDesc")}</p>
              </div>
              <p className="font-semibold text-primary">KES 50</p>
            </div>
            <div className="flex items-start justify-between gap-4 border-t border-border pt-4">
              <div>
                <p className="font-semibold">{t("planFeatured")}</p>
                <p className="text-muted-foreground">{t("planFeaturedDesc")}</p>
              </div>
              <p className="font-semibold text-primary">KES 300</p>
            </div>
            <p className="border-t border-border pt-4 text-muted-foreground">{t("mpesaNote")}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="grid gap-5">
            <div>
              <label htmlFor="title" className="mb-1.5 block text-sm font-medium">
                {t("labelTitle")}
              </label>
              <input
                id="title"
                required
                value={form.title}
                onChange={update("title")}
                placeholder={t("phTitle")}
                className={inputClass}
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="category" className="mb-1.5 block text-sm font-medium">
                  {t("labelCategory")}
                </label>
                <select id="category" value={form.category} onChange={update("category")} className={inputClass}>
                  {categories.map((c) => (
                    <option key={c.name} value={c.name}>
                      {categoryLabel(c.name, t)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="price" className="mb-1.5 block text-sm font-medium">
                  {t("labelPrice")}
                </label>
                <input
                  id="price"
                  required
                  value={form.price}
                  onChange={update("price")}
                  placeholder={t("phPrice")}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="location" className="mb-1.5 block text-sm font-medium">
                  {t("labelLocation")}
                </label>
                <input
                  id="location"
                  required
                  value={form.location}
                  onChange={update("location")}
                  placeholder={t("phLocation")}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">
                  {t("labelPhone")}
                </label>
                <input
                  id="phone"
                  required
                  type="tel"
                  value={form.phone}
                  onChange={update("phone")}
                  placeholder={t("phPhone")}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label htmlFor="description" className="mb-1.5 block text-sm font-medium">
                {t("labelDescription")}
              </label>
              <textarea
                id="description"
                required
                rows={4}
                value={form.description}
                onChange={update("description")}
                placeholder={t("phDescription")}
                className={inputClass}
              />
            </div>
            <fieldset>
              <legend className="mb-1.5 text-sm font-medium">{t("labelPlan")}</legend>
              <div className="grid gap-2 sm:grid-cols-3">
                {[
                  { value: "free", label: t("planFreeShort") },
                  { value: "extended", label: t("planExtendedShort") },
                  { value: "featured", label: t("planFeaturedShort") },
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
              disabled={sending}
              className="mt-2 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            >
              {sending ? "…" : t("submit")}
            </button>
            {error && <p className="text-center text-sm text-destructive">{error}</p>}
            <p className="text-center text-xs text-muted-foreground">{t("termsNote")}</p>
          </div>
        </form>
      </div>
    </div>
  );
}
