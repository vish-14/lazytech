import { Resend } from "resend";
import { BRAND } from "@/data/site";
import ReminderEmail from "@/emails/ReminderEmail";
import * as React from "react";
import { getSupabaseAdmin } from "./supabase-admin.server";

// Define a global object to hold timer IDs across hot-reloads
const globalAny: any = globalThis;
if (!globalAny.__lazytech_reminders) {
  globalAny.__lazytech_reminders = new Map<string, NodeJS.Timeout[]>();
}
const remindersMap: Map<string, NodeJS.Timeout[]> = globalAny.__lazytech_reminders;

export function scheduleReminders(orderId: string, email: string, name: string) {
  const intervals = [
    { label: "in 5 minutes", ms: 5 * 60 * 1000 },
    { label: "in 15 minutes", ms: 15 * 60 * 1000 },
    { label: "in 45 minutes", ms: 45 * 60 * 1000 },
    { label: "in 2 hours", ms: 2 * 60 * 60 * 1000 },
    { label: "in 6 hours", ms: 6 * 60 * 60 * 1000 },
    { label: "in 24 hours", ms: 24 * 60 * 60 * 1000 },
    { label: "in 2 days", ms: 2 * 24 * 60 * 60 * 1000 },
  ];

  const timeouts: NodeJS.Timeout[] = [];

  for (const interval of intervals) {
    const timer = setTimeout(async () => {
      try {
        // Double check if the payment is still uncompleted before sending!
        const supabaseAdmin = getSupabaseAdmin();
        const { data: payment } = await supabaseAdmin
          .from("payments")
          .select("status")
          .eq("razorpay_order_id", orderId)
          .single();
          
        if (payment?.status !== "created") {
           // Payment was completed or failed, don't send reminder
           return;
        }

        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: BRAND.senderEmail,
          to: email,
          subject: `Action Required: Complete your LazyTech Registration`,
          react: React.createElement(ReminderEmail, {
            name,
            intervalText: interval.label,
          }),
        });
      } catch (err) {
        console.error(`Failed to send reminder for ${orderId}`, err);
      }
    }, interval.ms);

    // Ensure timeouts don't block the Node event loop from exiting if needed
    if (timer.unref) timer.unref();
    timeouts.push(timer);
  }

  remindersMap.set(orderId, timeouts);
}

export function cancelReminders(orderId: string) {
  const timeouts = remindersMap.get(orderId);
  if (timeouts) {
    for (const t of timeouts) {
      clearTimeout(t);
    }
    remindersMap.delete(orderId);
  }
}
