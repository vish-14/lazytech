import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getSupabaseAdmin } from "@/lib/supabase-admin.server";
import { ArrowLeft, Copy, ExternalLink, MousePointerClick, Users, CreditCard, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

const fetchLinkDetails = createServerFn({ method: "GET" })
  .validator((shortCode: string) => shortCode)
  .handler(async ({ data: shortCode }) => {
    const supabase = getSupabaseAdmin();
    
    // Fetch Link
    const { data: link, error } = await supabase
      .from("utm_links")
      .select("*")
      .eq("short_code", shortCode)
      .single();
      
    if (error || !link) throw new Error("Link not found");

    // Fetch Events for this link
    const { data: events } = await supabase
      .from("tracking_events")
      .select("*")
      .eq("utm_link_id", link.id)
      .order("created_at", { ascending: true });
      
    const evs = events || [];
    
    const clicks = evs.filter(e => e.event_type === "LINK_CLICK").length;
    const visitors = new Set(evs.map(e => e.visitor_id)).size;
    const pageViews = evs.filter(e => e.event_type === "PAGE_VIEW").length;
    const checkoutStarts = new Set(evs.filter(e => e.event_type === "CHECKOUT_STARTED").map(e => e.session_id)).size;
    const paid = evs.filter(e => e.event_type === "PAYMENT_SUCCESS").length;
    const failed = evs.filter(e => e.event_type === "PAYMENT_FAILED").length;
    
    const revenue = paid * (link.product_type === "lazypass" ? 499 : link.product_type === "workshop-01" ? 59 : 0);
    
    const conversion = visitors > 0 ? ((paid / visitors) * 100).toFixed(2) + "%" : "0.00%";

    return {
      link,
      stats: { clicks, visitors, pageViews, checkoutStarts, paid, failed, revenue, conversion },
      recentEvents: evs.slice(-20).reverse()
    };
  });

export const Route = createFileRoute("/admin/utm-links/$shortCode")({
  loader: ({ params }) => fetchLinkDetails({ data: params.shortCode }),
  component: UtmLinkDetails,
});

function KPICard({ title, value, icon: Icon, colorClass }: { title: string, value: string | number, icon: any, colorClass?: string }) {
  return (
    <div className="bg-[#111] border border-[#222] p-5 rounded-xl flex items-center justify-between">
      <div>
        <h3 className="text-sm font-medium text-[#F5F5F0]/60 mb-1">{title}</h3>
        <p className={`text-2xl font-bold ${colorClass || "text-[#F5F5F0]"}`}>{value}</p>
      </div>
      <div className="p-3 bg-[#1a1a1a] rounded-lg">
        <Icon className={`h-6 w-6 ${colorClass || "text-[#F5F5F0]/50"}`} />
      </div>
    </div>
  );
}

function UtmLinkDetails() {
  const { link, stats, recentEvents } = Route.useLoaderData();

  const handleCopy = () => {
    const url = `${window.location.origin}/r/${link.short_code}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/utm-links" className="p-2 rounded-md hover:bg-[#F5F5F0]/10 text-[#F5F5F0]/70 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-[#F5F5F0]">{link.name}</h1>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${link.is_active ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-[#222] text-[#F5F5F0]/50'}`}>
                {link.is_active ? 'Active' : 'Disabled'}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2 text-sm text-[#F5F5F0]/70 bg-[#111] px-3 py-1 rounded-md border border-[#222]">
                <span className="text-[#E5092F] font-mono">/r/{link.short_code}</span>
                <button onClick={handleCopy} className="hover:text-[#F5F5F0]">
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
              <a href={`/r/${link.short_code}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300">
                Test Link <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard title="Total Clicks" value={stats.clicks} icon={MousePointerClick} />
        <KPICard title="Unique Visitors" value={stats.visitors} icon={Users} />
        <KPICard title="Checkout Starts" value={stats.checkoutStarts} icon={CreditCard} />
        <KPICard title="Successful Paid" value={stats.paid} icon={CheckCircle2} colorClass="text-green-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Funnel */}
        <div className="col-span-1 md:col-span-2 bg-[#111] border border-[#222] rounded-xl p-6">
          <h2 className="text-lg font-bold text-[#F5F5F0] mb-6">Conversion Funnel</h2>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-1/4 text-right text-sm font-medium text-[#F5F5F0]/70">Link Clicks</div>
              <div className="flex-1">
                <div className="h-8 bg-[#E5092F] rounded-md relative flex items-center px-4" style={{ width: '100%' }}>
                  <span className="font-bold text-white z-10">{stats.clicks}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-1/4 text-right text-sm font-medium text-[#F5F5F0]/70">Unique Visitors</div>
              <div className="flex-1">
                <div className="h-8 bg-[#E5092F]/80 rounded-md relative flex items-center px-4" style={{ width: `${stats.clicks ? Math.max(5, (stats.visitors / stats.clicks) * 100) : 0}%` }}>
                  <span className="font-bold text-white z-10">{stats.visitors}</span>
                </div>
              </div>
              <div className="w-16 text-xs text-[#F5F5F0]/50 text-right">
                {stats.clicks ? ((stats.visitors / stats.clicks) * 100).toFixed(1) : 0}%
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-1/4 text-right text-sm font-medium text-[#F5F5F0]/70">Checkout Starts</div>
              <div className="flex-1">
                <div className="h-8 bg-[#E5092F]/60 rounded-md relative flex items-center px-4" style={{ width: `${stats.visitors ? Math.max(5, (stats.checkoutStarts / stats.visitors) * 100) : 0}%` }}>
                  <span className="font-bold text-white z-10">{stats.checkoutStarts}</span>
                </div>
              </div>
              <div className="w-16 text-xs text-[#F5F5F0]/50 text-right">
                {stats.visitors ? ((stats.checkoutStarts / stats.visitors) * 100).toFixed(1) : 0}%
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-1/4 text-right text-sm font-medium text-[#F5F5F0]/70">Paid Success</div>
              <div className="flex-1">
                <div className="h-8 bg-green-500 rounded-md relative flex items-center px-4" style={{ width: `${stats.checkoutStarts ? Math.max(5, (stats.paid / stats.checkoutStarts) * 100) : 0}%` }}>
                  <span className="font-bold text-white z-10">{stats.paid}</span>
                </div>
              </div>
              <div className="w-16 text-xs font-bold text-green-500 text-right">
                {stats.checkoutStarts ? ((stats.paid / stats.checkoutStarts) * 100).toFixed(1) : 0}%
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-[#222] grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm text-[#F5F5F0]/50">Conversion Rate</div>
              <div className="text-xl font-bold text-green-500">{stats.conversion}</div>
            </div>
            <div>
              <div className="text-sm text-[#F5F5F0]/50">Failed Payments</div>
              <div className="text-xl font-bold text-red-500">{stats.failed}</div>
            </div>
            <div>
              <div className="text-sm text-[#F5F5F0]/50">Revenue</div>
              <div className="text-xl font-bold text-[#F5F5F0]">₹{stats.revenue.toLocaleString('en-IN')}</div>
            </div>
          </div>
        </div>

        {/* UTM Info */}
        <div className="col-span-1 bg-[#111] border border-[#222] rounded-xl p-6">
          <h2 className="text-lg font-bold text-[#F5F5F0] mb-4">Configuration</h2>
          <div className="space-y-4">
            <div>
              <div className="text-xs text-[#F5F5F0]/50 uppercase tracking-wider mb-1">Destination</div>
              <div className="text-sm text-[#F5F5F0] truncate" title={link.destination}>{link.destination}</div>
            </div>
            <div>
              <div className="text-xs text-[#F5F5F0]/50 uppercase tracking-wider mb-1">Product</div>
              <div className="text-sm text-[#F5F5F0]">{link.product_type || "None"}</div>
            </div>
            
            <div className="h-px bg-[#222] my-2" />
            
            <div>
              <div className="text-xs text-[#F5F5F0]/50 uppercase tracking-wider mb-1">utm_source</div>
              <div className="text-sm font-mono text-[#F5F5F0]">{link.utm_source || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-[#F5F5F0]/50 uppercase tracking-wider mb-1">utm_medium</div>
              <div className="text-sm font-mono text-[#F5F5F0]">{link.utm_medium || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-[#F5F5F0]/50 uppercase tracking-wider mb-1">utm_campaign</div>
              <div className="text-sm font-mono text-[#F5F5F0]">{link.utm_campaign || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-[#F5F5F0]/50 uppercase tracking-wider mb-1">utm_content</div>
              <div className="text-sm font-mono text-[#F5F5F0]">{link.utm_content || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-[#F5F5F0]/50 uppercase tracking-wider mb-1">Created At</div>
              <div className="text-sm text-[#F5F5F0]">{new Date(link.created_at).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Events Feed */}
      <div className="bg-[#111] border border-[#222] rounded-xl p-6">
        <h2 className="text-lg font-bold text-[#F5F5F0] mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {recentEvents.length === 0 ? (
            <div className="text-sm text-[#F5F5F0]/50">No activity yet.</div>
          ) : (
            recentEvents.map((e: any, i: number) => (
              <div key={i} className="flex items-center gap-3 text-sm py-2 border-b border-[#222] last:border-0">
                <div className="text-[#F5F5F0]/40 w-16 shrink-0 text-xs">
                  {new Date(e.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="flex-1 text-[#F5F5F0]">
                  {e.event_type === "LINK_CLICK" && <span className="text-blue-400 font-medium">Click recorded</span>}
                  {e.event_type === "PAGE_VIEW" && <span className="text-[#F5F5F0]/70">Viewed landing page</span>}
                  {e.event_type === "CHECKOUT_STARTED" && <span className="text-yellow-400 font-medium">Started checkout</span>}
                  {e.event_type === "PAYMENT_SUCCESS" && <span className="text-green-500 font-medium">Payment successful</span>}
                  {e.event_type === "PAYMENT_FAILED" && <span className="text-red-500 font-medium">Payment failed</span>}
                  {e.event_type === "PAYMENT_CANCELLED" && <span className="text-red-400 font-medium">Payment cancelled</span>}
                  <span className="text-[#F5F5F0]/40 ml-2 text-xs font-mono">Visitor: {e.visitor_id.substring(0,8)}...</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
