import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { BRAND } from "@/data/site";
import { Resend } from "resend";
import ReminderEmail from "@/emails/ReminderEmail";
import * as React from "react";

const bodySchema = z.object({
  leadId: z.string().uuid().optional(),
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(5).max(20),
});

export const Route = createFileRoute("/api/razorpay/create-order")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const parsed = bodySchema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return Response.json({ error: "Invalid request" }, { status: 400 });

        try {
          const { createRazorpayOrder, razorpayKeys } = await import("@/lib/razorpay.server");
          const { getSupabaseAdmin } = await import("@/lib/supabase-admin.server");

          // Price is fixed server-side; never trust the client.
          const amountPaise = BRAND.price * 100;
          const order = await createRazorpayOrder({
            amountPaise,
            receipt: `lazypass_${Date.now()}`,
            notes: { email: parsed.data.email, leadId: parsed.data.leadId ?? "" },
          });

          // Schedule reminder emails
          const scheduledIds: string[] = [];
          if (process.env.RESEND_API_KEY) {
            const resend = new Resend(process.env.RESEND_API_KEY);
            const intervals = [
              { label: "in 5 minutes", ms: 5 * 60 * 1000 },
              { label: "in 15 minutes", ms: 15 * 60 * 1000 },
              { label: "in 45 minutes", ms: 45 * 60 * 1000 },
              { label: "in 2 hours", ms: 2 * 60 * 60 * 1000 },
              { label: "in 6 hours", ms: 6 * 60 * 60 * 1000 },
              { label: "in 12 hours", ms: 12 * 60 * 60 * 1000 },
              { label: "in 24 hours", ms: 24 * 60 * 60 * 1000 },
              { label: "in 2 days", ms: 2 * 24 * 60 * 60 * 1000 },
              { label: "in 3 days", ms: 3 * 24 * 60 * 60 * 1000 },
            ];

            const emailPromises = intervals.map(async (interval) => {
              const sendAt = new Date(Date.now() + interval.ms).toISOString();
              try {
                const res = await resend.emails.send({
                  from: BRAND.senderEmail,
                  to: parsed.data.email,
                  subject: `Action Required: Complete your LazyTech Registration`,
                  react: React.createElement(ReminderEmail, {
                    name: parsed.data.name,
                    intervalText: interval.label,
                  }),
                  scheduledAt: sendAt,
                });
                if (res.data?.id) return res.data.id;
              } catch (e) {
                console.error("Failed to schedule email:", e);
              }
              return null;
            });

            const results = await Promise.all(emailPromises);
            scheduledIds.push(...results.filter((id): id is string => id !== null));
          }

          const supabaseAdmin = getSupabaseAdmin();
          await supabaseAdmin.from("payments").insert({
            lead_id: parsed.data.leadId ?? null,
            name: parsed.data.name,
            email: parsed.data.email,
            phone: parsed.data.phone,
            amount: amountPaise,
            currency: "INR",
            razorpay_order_id: order.id,
            status: "created",
            notes: { scheduled_emails: scheduledIds },
          });

          return Response.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: razorpayKeys().keyId,
          });
        } catch (err) {
          console.error("create-order failed", err);
          return Response.json({ error: "Could not start payment" }, { status: 500 });
        }
      },
    },
  },
});
