import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * AI auto-review of a newly posted ad. Public (the poster has no account),
 * but it only acts on a still-pending ad that has never been reviewed, so
 * calling it repeatedly changes nothing.
 */
export const reviewAd = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ code: z.string().min(4).max(20) }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: ad } = await supabaseAdmin
      .from("ads")
      .select("*")
      .eq("code", data.code)
      .eq("status", "pending")
      .is("ai_decision", null)
      .maybeSingle();
    if (!ad) return { decision: null };

    const { streamText, Output } = await import("ai");
    const { createGateway, reasoningOptions } = await import("@/server/ai.server");
    const gw = createGateway();
    let decision: "approve" | "reject" | "unsure" = "unsure";
    let reason = "AI review unavailable";
    try {
      const result = streamText({
        model: gw.model,
        system: `You moderate a classifieds site for rural Kenya (categories: Rentals, Jobs, Car Hire).
Approve: genuine, clear ads that fit the category, with a sensible price and location.
Reject: scams (asking for upfront fees/deposits before viewing, "registration fee" jobs, too-good-to-be-true pay), illegal goods or services, adult content, hate, spam/gibberish, or ads unrelated to the 3 categories.
Unsure: anything you cannot confidently judge. Give a short reason (max 20 words).`,
        prompt: JSON.stringify({
          title: ad.title,
          category: ad.category,
          price: ad.price,
          location: ad.location,
          description: ad.description,
        }),
        output: Output.object({
          schema: z.object({ decision: z.enum(["approve", "reject", "unsure"]), reason: z.string() }),
        }),
        providerOptions: reasoningOptions,
      });
      const out = await result.output;
      decision = out.decision;
      reason = out.reason.slice(0, 300);
    } catch (e) {
      console.error("AI review failed", e);
    }

    const free = ad.plan === "free";
    const paid = ad.payment_status === "paid";
    const changes: { ai_decision: string; ai_reason: string; status?: string; approved_at?: string } = { ai_decision: decision, ai_reason: reason };
    if (decision === "reject") changes.status = "rejected";
    if (decision === "approve" && (free || paid)) {
      changes.status = "approved";
      changes.approved_at = new Date().toISOString();
    }
    await supabaseAdmin.from("ads").update(changes).eq("id", ad.id);
    return { decision };
  });
