import { createFileRoute } from "@tanstack/react-router";
import { getSupabaseAdmin } from "@/lib/supabase-admin.server";

export const Route = createFileRoute("/r/$shortCode")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const { shortCode } = params;
        const supabase = getSupabaseAdmin();

        // Find the UTM link
        const { data: link, error } = await supabase
          .from("utm_links")
          .select("*")
          .eq("short_code", shortCode)
          .eq("is_active", true)
          .single();

        if (error || !link) {
          return new Response(null, {
            status: 302,
            headers: { Location: "/" }, // redirect to home if not found
          });
        }

        // Get or generate visitor/session IDs from cookies
        const url = new URL(request.url);
        const cookieStr = request.headers.get("cookie") || "";
        const cookies = Object.fromEntries(
          cookieStr.split(";").map((c) => {
            const parts = c.trim().split("=");
            return [parts[0], parts.slice(1).join("=")];
          })
        );

        const generateId = () => crypto.randomUUID();
        let visitorId = cookies["lt_visitor_id"] || generateId();
        let sessionId = cookies["lt_session_id"] || generateId();

        // Prepare the response
        const headers = new Headers();
        headers.set("Location", link.destination);

        // Set cookies with appropriate expiry
        const permanentCookie = `lt_visitor_id=${visitorId}; Path=/; Max-Age=${60 * 60 * 24 * 365 * 2}; SameSite=Lax`;
        const sessionCookie = `lt_session_id=${sessionId}; Path=/; Max-Age=${30 * 60}; SameSite=Lax`;
        
        const attribution = JSON.stringify({
          utm_link_id: link.id,
          utm_source: link.utm_source,
          utm_medium: link.utm_medium,
          utm_campaign: link.utm_campaign,
          utm_content: link.utm_content,
          utm_term: link.utm_term,
        });
        const attrEncoded = encodeURIComponent(attribution);

        // Always set last touch. First touch is set if it doesn't exist yet.
        const firstTouchCookie = cookies["lt_first_touch"] 
          ? null 
          : `lt_first_touch=${attrEncoded}; Path=/; Max-Age=${60 * 60 * 24 * 365 * 2}; SameSite=Lax`;
        const lastTouchCookie = `lt_last_touch=${attrEncoded}; Path=/; Max-Age=${60 * 60 * 24 * 365 * 2}; SameSite=Lax`;

        headers.append("Set-Cookie", permanentCookie);
        headers.append("Set-Cookie", sessionCookie);
        headers.append("Set-Cookie", lastTouchCookie);
        if (firstTouchCookie) headers.append("Set-Cookie", firstTouchCookie);

        // Record the event asynchronously
        supabase
          .from("tracking_events")
          .insert({
            visitor_id: visitorId,
            session_id: sessionId,
            utm_link_id: link.id,
            event_type: "LINK_CLICK",
            product_type: link.product_type,
            landing_page: link.destination,
            utm_source: link.utm_source,
            utm_medium: link.utm_medium,
            utm_campaign: link.utm_campaign,
            utm_content: link.utm_content,
            utm_term: link.utm_term,
            referrer: request.headers.get("referer") || "",
            device_type: /Mobi|Android/i.test(request.headers.get("user-agent") || "") ? "mobile" : "desktop",
            browser: "",
            operating_system: "",
            country: request.headers.get("cf-ipcountry") || "",
            region: "",
          })
          .then(({ error }) => {
            if (error) console.error("Failed to record link click", error);
          });

        return new Response(null, {
          status: 302,
          headers,
        });
      },
    },
  },
});
