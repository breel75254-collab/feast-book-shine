import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: "Book a Table — Ujamaa Bar & Restaurant, Maseno" },
      {
        name: "description",
        content:
          "Reserve a table at Ujamaa Bar & Restaurant, opposite Maseno University. Choose your date, time and party size — we'll confirm by phone.",
      },
      { property: "og:title", content: "Book a Table — Ujamaa Bar & Restaurant" },
      {
        property: "og:description",
        content:
          "Reserve a table at Ujamaa Bar & Restaurant in Maseno. Good food, cold beer, great vibes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BookingPage,
});

const inputClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

function BookingPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: "18:00",
    guests: "2",
    notes: "",
  });

  const today = new Date().toISOString().split("T")[0];

  function update(field: keyof typeof form) {
    return (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    ) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <div className="rounded-2xl border border-border bg-card p-10">
          <p className="text-4xl">🍻</p>
          <h1 className="mt-4 text-3xl font-bold">Asante, {form.name.split(" ")[0]}!</h1>
          <p className="mt-3 text-muted-foreground">
            Your table request for <strong className="text-foreground">{form.guests}</strong>{" "}
            {Number(form.guests) === 1 ? "guest" : "guests"} on{" "}
            <strong className="text-foreground">{form.date}</strong> at{" "}
            <strong className="text-foreground">{form.time}</strong> has been received.
            We'll confirm shortly on <strong className="text-foreground">{form.phone}</strong>.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Need to change something? Call us on{" "}
            <a href="tel:+254771324567" className="text-primary hover:underline">
              0771 324 567
            </a>
            .
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-8 rounded-full border border-input px-6 py-3 text-sm font-semibold transition-colors hover:bg-secondary"
          >
            Make another booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            Reservations
          </p>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Book a table</h1>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Planning dinner, drinks with friends or a group celebration? Send us your
            booking request and we'll have your table ready. We open daily from
            5:00 pm.
          </p>
          <div className="mt-8 space-y-3 rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
            <p>
              <span className="font-semibold text-foreground">Prefer to call?</span>{" "}
              Reach us on{" "}
              <a href="tel:+254771324567" className="text-primary hover:underline">
                0771 324 567
              </a>
            </p>
            <p>
              <span className="font-semibold text-foreground">Where:</span> Off
              Maseno–Kisumu Road, opposite Maseno University
            </p>
            <p>
              <span className="font-semibold text-foreground">Good to know:</span> Free
              parking on site · Great for groups · Walk-ins welcome
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-card p-6 sm:p-8"
        >
          <div className="grid gap-5">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                Your name
              </label>
              <input
                id="name"
                required
                value={form.name}
                onChange={update("name")}
                placeholder="e.g. Brian Otieno"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">
                Phone number
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
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="date" className="mb-1.5 block text-sm font-medium">
                  Date
                </label>
                <input
                  id="date"
                  required
                  type="date"
                  min={today}
                  value={form.date}
                  onChange={update("date")}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="time" className="mb-1.5 block text-sm font-medium">
                  Time
                </label>
                <input
                  id="time"
                  required
                  type="time"
                  min="17:00"
                  value={form.time}
                  onChange={update("time")}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label htmlFor="guests" className="mb-1.5 block text-sm font-medium">
                Number of guests
              </label>
              <select id="guests" value={form.guests} onChange={update("guests")} className={inputClass}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "guest" : "guests"}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="notes" className="mb-1.5 block text-sm font-medium">
                Special requests <span className="text-muted-foreground">(optional)</span>
              </label>
              <textarea
                id="notes"
                rows={3}
                value={form.notes}
                onChange={update("notes")}
                placeholder="Birthday, quiet corner, nyama choma pre-order..."
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              className="mt-2 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Request booking
            </button>
            <p className="text-center text-xs text-muted-foreground">
              We'll confirm your booking by phone or SMS.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
