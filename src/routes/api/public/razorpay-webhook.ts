import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import WelcomeEmail from "@/emails/WelcomeEmail";
import { BRAND } from "@/data/site";

export const Route = createFileRoute("/api/public/razorpay-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["RAZORPAY_WEBHOOK_SECRET"];
        if (!secret) return new Response("Not configured", { status: 500 });

        const raw = await request.text();
        const signature = request.headers.get("x-razorpay-signature") ?? "";

        const { hmacSha256Hex, timingSafeEqualHex } = await import("@/lib/razorpay.server");
        const expected = await hmacSha256Hex(secret, raw);
        if (!timingSafeEqualHex(expected, signature)) {
          return new Response("Invalid signature", { status: 401 });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let payload: any;
        try {
          payload = JSON.parse(raw);
        } catch {
          return new Response("Bad payload", { status: 400 });
        }

        const entity = payload?.payload?.payment?.entity ?? {};
        const orderId: string | undefined = entity.order_id;
        const paymentId: string | undefined = entity.id;
        const event: string = payload?.event ?? "unknown";

        const { getSupabaseAdmin } = await import("@/lib/supabase-admin.server");
        const supabaseAdmin = getSupabaseAdmin();

        await supabaseAdmin.from("payment_events").insert({
          event,
          razorpay_order_id: orderId ?? null,
          razorpay_payment_id: paymentId ?? null,
          payload,
        });

        if (orderId && (event === "payment.captured" || event === "payment.failed")) {
          const status = event === "payment.captured" ? "paid" : "failed";
          const { data: payment } = await supabaseAdmin
            .from("payments")
            .update({
              status,
              razorpay_payment_id: paymentId ?? null,
              updated_at: new Date().toISOString(),
            })
            .eq("razorpay_order_id", orderId)
            .select("lead_id, name, email, phone, notes, status")
            .maybeSingle();

          if (payment?.lead_id) {
            await supabaseAdmin
              .from("leads")
              .update({ payment_status: status })
              .eq("id", payment.lead_id);
          }

          // Only captured payments claim a seat and trigger emails.
          if (status === "paid" && payment?.email) {
            await supabaseAdmin.rpc("claim_seat", {
              _email: payment.email,
              _name: payment.name ?? null,
              _phone: payment.phone ?? null,
              _lead_id: payment.lead_id ?? null,
              _payment_id: paymentId ?? null,
            });

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

              // Send Welcome Email
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
        }

        return new Response("ok");
      },
    },
  },
});
