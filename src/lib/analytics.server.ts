import { getSupabaseAdmin } from "./supabase-admin.server";

export interface AnalyticsFilter {
  dateFrom?: string;
  dateTo?: string;
  productType?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmLinkId?: string;
}

export async function getDashboardStats(filter: AnalyticsFilter) {
  const supabase = getSupabaseAdmin();
  let eventsQuery = supabase.from("tracking_events").select("*");
  let paymentsQuery = supabase.from("payments").select("*");

  // Apply filters to both queries
  if (filter.dateFrom) {
    eventsQuery = eventsQuery.gte("created_at", filter.dateFrom);
    paymentsQuery = paymentsQuery.gte("created_at", filter.dateFrom);
  }
  if (filter.dateTo) {
    eventsQuery = eventsQuery.lte("created_at", filter.dateTo);
    paymentsQuery = paymentsQuery.lte("created_at", filter.dateTo);
  }
  if (filter.productType && filter.productType !== "all") {
    eventsQuery = eventsQuery.eq("product_type", filter.productType);
    paymentsQuery = paymentsQuery.eq("product_type", filter.productType);
  }
  if (filter.utmSource) {
    eventsQuery = eventsQuery.eq("utm_source", filter.utmSource);
    paymentsQuery = paymentsQuery.eq("last_touch_utm_source", filter.utmSource);
  }
  if (filter.utmMedium) {
    eventsQuery = eventsQuery.eq("utm_medium", filter.utmMedium);
    paymentsQuery = paymentsQuery.eq("last_touch_utm_medium", filter.utmMedium);
  }
  if (filter.utmCampaign) {
    eventsQuery = eventsQuery.eq("utm_campaign", filter.utmCampaign);
    paymentsQuery = paymentsQuery.eq("last_touch_utm_campaign", filter.utmCampaign);
  }
  if (filter.utmLinkId) {
    eventsQuery = eventsQuery.eq("utm_link_id", filter.utmLinkId);
    paymentsQuery = paymentsQuery.eq("utm_link_id", filter.utmLinkId);
  }

  const [{ data: events }, { data: payments }] = await Promise.all([
    eventsQuery,
    paymentsQuery,
  ]);

  const evs = events || [];
  const pays = payments || [];

  const totalClicks = evs.filter((e) => e.event_type === "LINK_CLICK").length;
  const uniqueVisitors = new Set(evs.map((e) => e.visitor_id)).size;
  const pageViews = evs.filter((e) => e.event_type === "PAGE_VIEW").length;
  
  // Checkout started comes from events or payments in 'created' state, but we rely on tracking events
  const checkoutStarts = new Set(evs.filter((e) => e.event_type === "CHECKOUT_STARTED").map(e => e.session_id)).size;

  const successfulPayments = pays.filter((p) => p.status === "paid");
  const failedPayments = pays.filter((p) => p.status === "failed");
  
  const revenue = successfulPayments.reduce((acc, p) => acc + (p.amount || 0), 0) / 100; // in INR
  
  const conversionRate = uniqueVisitors > 0 
    ? ((successfulPayments.length / uniqueVisitors) * 100).toFixed(2) + "%" 
    : "0.00%";

  // Recent activity
  const recentActivity = [
    ...evs.slice(0, 50).map(e => ({ type: "event", timestamp: e.created_at, data: e })),
    ...pays.slice(0, 50).map(p => ({ type: "payment", timestamp: p.created_at, data: p }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);

  return {
    totalClicks,
    uniqueVisitors,
    pageViews,
    checkoutStarts,
    paid: successfulPayments.length,
    failed: failedPayments.length,
    revenue,
    conversionRate,
    recentActivity,
  };
}

export async function getCampaignPerformance(filter: AnalyticsFilter) {
  const supabase = getSupabaseAdmin();
  let query = supabase.from("tracking_events").select("*");

  if (filter.dateFrom) query = query.gte("created_at", filter.dateFrom);
  if (filter.dateTo) query = query.lte("created_at", filter.dateTo);
  if (filter.productType && filter.productType !== "all") query = query.eq("product_type", filter.productType);
  if (filter.utmLinkId) query = query.eq("utm_link_id", filter.utmLinkId);

  const { data: events } = await query;
  if (!events) return [];

  const campaigns = new Map<string, any>();

  for (const e of events) {
    const key = `${e.utm_source || 'direct'}|${e.utm_medium || 'none'}|${e.utm_campaign || 'none'}`;
    if (!campaigns.has(key)) {
      campaigns.set(key, {
        source: e.utm_source || 'direct',
        medium: e.utm_medium || 'none',
        campaign: e.utm_campaign || 'none',
        clicks: 0,
        visitors: new Set(),
        checkouts: new Set(),
        revenue: 0,
        paid: 0,
        failed: 0,
      });
    }

    const c = campaigns.get(key);
    if (e.event_type === "LINK_CLICK") c.clicks++;
    c.visitors.add(e.visitor_id);
    if (e.event_type === "CHECKOUT_STARTED") c.checkouts.add(e.session_id);
    if (e.event_type === "PAYMENT_SUCCESS") {
      c.paid++;
      // revenue depends on amount, we can approximate or fetch payments specifically
      c.revenue += (e.product_type === "lazypass" ? 499 : e.product_type === "workshop-01" ? 59 : 0);
    }
    if (e.event_type === "PAYMENT_FAILED") c.failed++;
  }

  return Array.from(campaigns.values()).map(c => ({
    ...c,
    uniqueVisitors: c.visitors.size,
    checkoutStarts: c.checkouts.size,
    conversionRate: c.visitors.size > 0 ? ((c.paid / c.visitors.size) * 100).toFixed(2) + "%" : "0.00%",
  }));
}
