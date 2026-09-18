import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState, useEffect } from "react";
import { getDashboardStats, getCampaignPerformance, AnalyticsFilter } from "@/lib/analytics.server";
import { format, subDays, startOfMonth, subMonths } from "date-fns";

const fetchDashboardStats = createServerFn({ method: "POST" })
  .validator((data: AnalyticsFilter) => data)
  .handler(async ({ data }) => {
    return await getDashboardStats(data);
  });

const fetchCampaignPerformance = createServerFn({ method: "POST" })
  .validator((data: AnalyticsFilter) => data)
  .handler(async ({ data }) => {
    return await getCampaignPerformance(data);
  });

export const Route = createFileRoute("/admin/analytics")({
  component: AnalyticsDashboard,
});

function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState("last_30_days");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [product, setProduct] = useState("all");

  const [stats, setStats] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [dateRange, customFrom, customTo, product]);

  async function loadData() {
    setLoading(true);
    let dateFrom = "";
    let dateTo = new Date().toISOString();
    const today = new Date();

    if (dateRange === "today") dateFrom = format(today, "yyyy-MM-dd'T'00:00:00XXX");
    if (dateRange === "yesterday") {
      dateFrom = format(subDays(today, 1), "yyyy-MM-dd'T'00:00:00XXX");
      dateTo = format(subDays(today, 1), "yyyy-MM-dd'T'23:59:59XXX");
    }
    if (dateRange === "last_7_days") dateFrom = subDays(today, 7).toISOString();
    if (dateRange === "last_30_days") dateFrom = subDays(today, 30).toISOString();
    if (dateRange === "this_month") dateFrom = startOfMonth(today).toISOString();
    if (dateRange === "last_month") {
      dateFrom = startOfMonth(subMonths(today, 1)).toISOString();
      dateTo = startOfMonth(today).toISOString();
    }
    if (dateRange === "custom" && customFrom && customTo) {
      dateFrom = new Date(customFrom).toISOString();
      dateTo = new Date(customTo).toISOString();
    }

    const filter: AnalyticsFilter = { 
      productType: product, 
      dateFrom: dateFrom || undefined, 
      dateTo 
    };

    try {
      const [s, c] = await Promise.all([
        fetchDashboardStats({ data: filter }),
        fetchCampaignPerformance({ data: filter })
      ]);
      setStats(s);
      setCampaigns(c);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function KPICard({ title, value, loading }: { title: string, value: string | number, loading: boolean }) {
    return (
      <div className="bg-[#111] border border-[#222] p-5 rounded-xl">
        <h3 className="text-sm font-medium text-[#F5F5F0]/60 mb-2">{title}</h3>
        <p className="text-3xl font-bold text-[#F5F5F0]">
          {loading ? "..." : value}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#F5F5F0]">Analytics</h1>
          <p className="text-[#F5F5F0]/60 mt-1">Traffic, conversions, and revenue</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <select 
            value={product} 
            onChange={e => setProduct(e.target.value)}
            className="bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#F5F5F0] focus:outline-none focus:border-[#E5092F]"
          >
            <option value="all">All Products</option>
            <option value="workshop-01">Workshop #01 (₹59)</option>
            <option value="lazypass">Lazy Pass (₹499)</option>
          </select>

          <select 
            value={dateRange} 
            onChange={e => setDateRange(e.target.value)}
            className="bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#F5F5F0] focus:outline-none focus:border-[#E5092F]"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="last_7_days">Last 7 Days</option>
            <option value="last_30_days">Last 30 Days</option>
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
            <option value="custom">Custom Range</option>
          </select>

          {dateRange === "custom" && (
            <div className="flex items-center gap-2">
              <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)} className="bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#F5F5F0]" />
              <span className="text-[#F5F5F0]/50">to</span>
              <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)} className="bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#F5F5F0]" />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Total Clicks" value={stats?.totalClicks ?? 0} loading={loading} />
        <KPICard title="Unique Visitors" value={stats?.uniqueVisitors ?? 0} loading={loading} />
        <KPICard title="Checkout Starts" value={stats?.checkoutStarts ?? 0} loading={loading} />
        <KPICard title="Conversion Rate" value={stats?.conversionRate ?? "0.00%"} loading={loading} />
        
        <KPICard title="Successful Paid" value={stats?.paid ?? 0} loading={loading} />
        <KPICard title="Failed" value={stats?.failed ?? 0} loading={loading} />
        <KPICard title="Revenue" value={`₹${stats?.revenue?.toLocaleString("en-IN") ?? 0}`} loading={loading} />
        <KPICard title="Page Views" value={stats?.pageViews ?? 0} loading={loading} />
      </div>

      <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
        <div className="p-5 border-b border-[#222]">
          <h2 className="text-lg font-bold text-[#F5F5F0]">Campaign Performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#F5F5F0]">
            <thead className="bg-[#1a1a1a] text-[#F5F5F0]/60 uppercase text-xs">
              <tr>
                <th className="px-5 py-3 font-medium">Source / Medium / Campaign</th>
                <th className="px-5 py-3 font-medium text-right">Clicks</th>
                <th className="px-5 py-3 font-medium text-right">Unique</th>
                <th className="px-5 py-3 font-medium text-right">Checkouts</th>
                <th className="px-5 py-3 font-medium text-right">Paid</th>
                <th className="px-5 py-3 font-medium text-right">Revenue</th>
                <th className="px-5 py-3 font-medium text-right">Conv.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-[#F5F5F0]/50">
                    No campaign data available for this range.
                  </td>
                </tr>
              ) : (
                campaigns.map((c, i) => (
                  <tr key={i} className="hover:bg-[#1a1a1a]/50">
                    <td className="px-5 py-3">
                      <div className="font-medium text-[#F5F5F0]">{c.campaign}</div>
                      <div className="text-xs text-[#F5F5F0]/50 mt-0.5">{c.source} / {c.medium}</div>
                    </td>
                    <td className="px-5 py-3 text-right">{c.clicks}</td>
                    <td className="px-5 py-3 text-right">{c.uniqueVisitors}</td>
                    <td className="px-5 py-3 text-right">{c.checkoutStarts}</td>
                    <td className="px-5 py-3 text-right font-medium text-green-500">{c.paid}</td>
                    <td className="px-5 py-3 text-right">₹{c.revenue.toLocaleString("en-IN")}</td>
                    <td className="px-5 py-3 text-right">{c.conversionRate}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
