import { createFileRoute } from "@tanstack/react-router";
import { getSupabaseAdmin } from "@/lib/supabase-admin.server";

export const Route = createFileRoute("/api/public/events")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json().catch(() => null);
          if (!body || !body.visitor_id || !body.session_id) {
            return new Response(null, { status: 400 });
          }

          const supabaseAdmin = getSupabaseAdmin();
          
          await supabaseAdmin.from("tracking_events").insert({
            visitor_id: body.visitor_id,
            session_id: body.session_id,
            event_type: body.event_type,
            product_type: body.product_type,
            landing_page: body.landing_page,
            utm_link_id: body.utm_link_id,
            utm_source: body.utm_source,
            utm_medium: body.utm_medium,
            utm_campaign: body.utm_campaign,
            utm_content: body.utm_content,
            utm_term: body.utm_term,
            referrer: body.referrer,
            device_type: body.device_type,
            metadata: body.metadata,
          });

          return new Response(null, { status: 204 });
        } catch (e) {
          return new Response(null, { status: 500 });
        }
      },
    },
  },
});
