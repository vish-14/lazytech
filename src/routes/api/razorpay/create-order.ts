import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import * as React from "react";
import { scheduleReminders } from "@/lib/scheduler.server";

const bodySchema = z.object({
  leadId: z.string().uuid().optional(),
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(5).max(20),
  college: z.string().trim().max(120).optional(),
  role: z.string().trim().max(120).optional(),
  productType: z.enum(["workshop-01", "lazypass"]).default("lazypass"),
});

const PRODUCT_PRICES = {
  "workshop-01": 5900, // ₹59
  "lazypass": 49900,   // ₹499
};

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
          const productType = parsed.data.productType;
          const amountPaise = PRODUCT_PRICES[productType];
          
          if (!amountPaise) return Response.json({ error: "Invalid product" }, { status: 400 });

          const order = await createRazorpayOrder({
            amountPaise,
            receipt: `${productType}_${Date.now()}`,
            notes: { 
              email: parsed.data.email, 
              leadId: parsed.data.leadId ?? "",
              productType: productType,
              college: parsed.data.college ?? "",
              role: parsed.data.role ?? "",
            },
          });

          // Schedule reminder emails natively in memory because Resend ignores scheduledAt on the free tier
          if (process.env.RESEND_API_KEY && productType === "lazypass") {
            scheduleReminders(order.id, parsed.data.email, parsed.data.name);
          }

          const supabaseAdmin = getSupabaseAdmin();

          // Extract tracking cookies
          const cookieStr = request.headers.get("cookie") || "";
          const cookies = Object.fromEntries(
            cookieStr.split(";").map((c) => {
              const parts = c.trim().split("=");
              return [parts[0], parts.slice(1).join("=")];
            })
          );

          let visitorId = cookies["lt_visitor_id"] || "";
          let sessionId = cookies["lt_session_id"] || "";
          let firstTouch: any = {};
          let lastTouch: any = {};
          
          try {
            if (cookies["lt_first_touch"]) firstTouch = JSON.parse(decodeURIComponent(cookies["lt_first_touch"]));
            if (cookies["lt_last_touch"]) lastTouch = JSON.parse(decodeURIComponent(cookies["lt_last_touch"]));
          } catch (e) {}

          await supabaseAdmin.from("payments").insert({
            lead_id: parsed.data.leadId ?? null,
            name: parsed.data.name,
            email: parsed.data.email,
            phone: parsed.data.phone,
            amount: amountPaise,
            currency: "INR",
            razorpay_order_id: order.id,
            status: "created",
            visitor_id: visitorId,
            session_id: sessionId,
            utm_link_id: lastTouch.utm_link_id || null,
            first_touch_utm_source: firstTouch.utm_source,
            first_touch_utm_medium: firstTouch.utm_medium,
            first_touch_utm_campaign: firstTouch.utm_campaign,
            first_touch_utm_content: firstTouch.utm_content,
            first_touch_utm_term: firstTouch.utm_term,
            last_touch_utm_source: lastTouch.utm_source,
            last_touch_utm_medium: lastTouch.utm_medium,
            last_touch_utm_campaign: lastTouch.utm_campaign,
            last_touch_utm_content: lastTouch.utm_content,
            last_touch_utm_term: lastTouch.utm_term,
            product_type: productType,
            notes: {
              productType,
              college: parsed.data.college ?? "",
              role: parsed.data.role ?? "",
            },
          });

          // Also log checkout started event
          supabaseAdmin.from("tracking_events").insert({
            visitor_id: visitorId || "unknown",
            session_id: sessionId || "unknown",
            utm_link_id: lastTouch.utm_link_id || null,
            event_type: "CHECKOUT_STARTED",
            product_type: productType,
            utm_source: lastTouch.utm_source,
            utm_medium: lastTouch.utm_medium,
            utm_campaign: lastTouch.utm_campaign,
          }).then();

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
