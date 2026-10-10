import { createFileRoute } from "@tanstack/react-router";

const HELP = `You are the friendly helpdesk for Tangaza Africa, a simple classifieds site for rural Kenya (Rentals, Jobs, Car Hire).
Reply in the language the user writes in (English or Kiswahili). Keep answers short and simple — users may be on basic phones and slow networks.
Facts:
- Post an ad on the "Post an ad" page: title, category, price, location, phone, description. No sign-up needed.
- Plans: Free (7 days), Extended KES 50 (30 days), Featured KES 300 (top of the list + verified check). Payment is by M-Pesa only, no cards.
- New ads are checked automatically. Good free ads go live within a minute. Paid ads go live once the M-Pesa payment is confirmed. Unclear ads are checked by our team.
- Featured ads show first, then Extended, then Free; verified ads come first within each group.
- Every ad gets a code (e.g. RN123456). Keep it to edit or renew the ad.
- Buyers contact sellers directly with the Call or WhatsApp buttons.
- Safety: never pay any money before viewing a house or meeting in person. Jobs never require a registration fee.
If you don't know something (e.g. a specific ad's status, refunds), say a team member will help and suggest they reply with their ad code. Never invent phone numbers or prices.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { streamText, convertToModelMessages } = await import("ai");
        const { createGateway, reasoningOptions } = await import("@/server/ai.server");
        const body = (await request.json()) as { messages?: unknown[] };
        const messages = Array.isArray(body.messages) ? body.messages.slice(-30) : [];
        const gw = createGateway(request.headers.get("X-Lovable-AIG-Run-ID") ?? undefined);
        const result = streamText({
          model: gw.model,
          system: HELP,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          messages: await convertToModelMessages(messages as any),
          abortSignal: request.signal,
          providerOptions: reasoningOptions,
        });
        return result.toUIMessageStreamResponse({
          onError: () => "Sorry, the helpdesk is busy. Please try again in a moment.",
        });
      },
    },
  },
});
