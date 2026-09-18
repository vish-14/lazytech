import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import * as React from "react";
import WelcomeEmail from "@/emails/WelcomeEmail";
import { BRAND } from "@/data/site";

const bodySchema = z.object({
  razorpay_order_id: z.string().min(4).max(80),
  razorpay_payment_id: z.string().min(4).max(80),
  razorpay_signature: z.string().min(10).max(200),
});

export const Route = createFileRoute("/api/razorpay/verify")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const parsed = bodySchema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return Response.json({ error: "Invalid request" }, { status: 400 });
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;

        try {
          const { razorpayKeys, hmacSha256Hex, timingSafeEqualHex } =
            await import("@/lib/razorpay.server");
          const { getSupabaseAdmin } = await import("@/lib/supabase-admin.server");

          const expected = await hmacSha256Hex(
            razorpayKeys().keySecret,
            `${razorpay_order_id}|${razorpay_payment_id}`,
          );
          if (!timingSafeEqualHex(expected, razorpay_signature)) {
            return Response.json({ error: "Signature mismatch" }, { status: 400 });
          }

          const supabaseAdmin = getSupabaseAdmin();
          const { data: payment } = await supabaseAdmin
            .from("payments")
            .update({
              razorpay_payment_id,
              razorpay_signature,
              status: "paid",
              updated_at: new Date().toISOString(),
            })
            .eq("razorpay_order_id", razorpay_order_id)
            .select("lead_id, name, email, phone, notes")
            .maybeSingle();

          if (payment?.lead_id) {
            await supabaseAdmin
              .from("leads")
              .update({ payment_status: "paid" })
              .eq("id", payment.lead_id);
          }

          let builderNumber: number | null = null;
          if (payment?.email) {
            const { data: seat } = await supabaseAdmin.rpc("claim_seat", {
              _email: payment.email,
              _name: payment.name ?? null,
              _phone: payment.phone ?? null,
              _lead_id: payment.lead_id ?? null,
              _payment_id: razorpay_payment_id,
            });
            builderNumber = typeof seat === "number" ? seat : null;

            // Dispatch welcome email using Resend and cancel reminders
            try {
              const { Resend } = await import("resend");
              const resend = new Resend(process.env["RESEND_API_KEY"]);

              // Cancel scheduled reminders
              const scheduledEmails = (payment.notes as Record<string, unknown>)?.scheduled_emails as string[];
              if (Array.isArray(scheduledEmails)) {
                for (const id of scheduledEmails) {
                  await resend.emails.cancel(id).catch((e) => console.error("Cancel err", e));
                }
              }

              await resend.emails.send({
                from: BRAND.senderEmail,
                to: [payment.email],
                subject: "Welcome to LazyTech! Your payment is confirmed",
                react: React.createElement(WelcomeEmail, { name: payment.name ?? "Builder" }),
              });
            } catch (emailErr) {
              console.error("Failed to send welcome email", emailErr);
            }
          }

          return Response.json({ ok: true, builderNumber });
        } catch (err) {
          console.error("verify failed", err);
          return Response.json({ error: "Verification failed" }, { status: 500 });
        }
      },
    },
  },
});
