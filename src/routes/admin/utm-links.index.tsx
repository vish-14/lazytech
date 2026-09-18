import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getSupabaseAdmin } from "@/lib/supabase-admin.server";
import { Copy, Plus, ExternalLink, Activity } from "lucide-react";
import { toast } from "sonner";

const fetchUtmLinks = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("utm_links")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  
  // also fetch basic click stats for each link
  const { data: statsData } = await supabase.from("tracking_events").select("utm_link_id, event_type");
  
  const linkStats = new Map();
  statsData?.forEach(e => {
    if (!e.utm_link_id) return;
    if (!linkStats.has(e.utm_link_id)) linkStats.set(e.utm_link_id, { clicks: 0 });
    if (e.event_type === "LINK_CLICK") {
      linkStats.get(e.utm_link_id).clicks++;
    }
  });

  return (data || []).map(link => ({
    ...link,
    clicks: linkStats.get(link.id)?.clicks || 0
  }));
});

export const Route = createFileRoute("/admin/utm-links/")({
  loader: () => fetchUtmLinks(),
  component: UtmLinksList,
});

function UtmLinksList() {
  const links = Route.useLoaderData();

  const handleCopy = (shortCode: string) => {
    const url = `${window.location.origin}/r/${shortCode}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#F5F5F0]">Tracking Links</h1>
          <p className="text-[#F5F5F0]/60 mt-1">Manage and measure your UTM campaign links</p>
        </div>
        <Link
          to="/admin/utm-links/new"
          className="inline-flex items-center gap-2 rounded-md bg-[#E5092F] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#E5092F]/90"
        >
          <Plus className="h-4 w-4" />
          Create Link
        </Link>
      </div>

      <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#F5F5F0]">
            <thead className="bg-[#1a1a1a] text-[#F5F5F0]/60 uppercase text-xs">
              <tr>
                <th className="px-5 py-3 font-medium">Link Name</th>
                <th className="px-5 py-3 font-medium">Short URL</th>
                <th className="px-5 py-3 font-medium">Source / Campaign</th>
                <th className="px-5 py-3 font-medium text-right">Clicks</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {links.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-[#F5F5F0]/50">
                    No tracking links created yet.
                  </td>
                </tr>
              ) : (
                links.map((link) => (
                  <tr key={link.id} className="hover:bg-[#1a1a1a]/50">
                    <td className="px-5 py-4">
                      <div className="font-medium">{link.name}</div>
                      <div className="text-xs text-[#F5F5F0]/50 truncate max-w-[200px] mt-0.5" title={link.destination}>
                        {link.destination}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[#E5092F]">/r/{link.short_code}</span>
                        <button onClick={() => handleCopy(link.short_code)} className="text-[#F5F5F0]/50 hover:text-[#F5F5F0]">
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center rounded-full border border-[#222] bg-[#1a1a1a] px-2 py-0.5 text-xs font-medium text-[#F5F5F0]/70">
                        {link.utm_source || 'direct'}
                      </span>
                      {link.utm_campaign && (
                        <div className="text-xs text-[#F5F5F0]/50 mt-1 pl-1">{link.utm_campaign}</div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right font-medium">
                      {link.clicks}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${link.is_active ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-[#222] text-[#F5F5F0]/50'}`}>
                        {link.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <a href={`/r/${link.short_code}`} target="_blank" rel="noreferrer" className="text-[#F5F5F0]/50 hover:text-[#F5F5F0]" title="Test link">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        <Link to={`/admin/utm-links/${link.short_code}`} className="text-[#F5F5F0]/50 hover:text-blue-400" title="View Analytics">
                          <Activity className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
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
