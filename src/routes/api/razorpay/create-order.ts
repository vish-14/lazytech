import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { BRAND } from "@/data/site";
import * as React from "react";
import { scheduleReminders } from "@/lib/scheduler.server";

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

          // Schedule reminder emails natively in memory because Resend ignores scheduledAt on the free tier
          if (process.env.RESEND_API_KEY) {
            scheduleReminders(order.id, parsed.data.email, parsed.data.name);
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
            notes: {},
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
