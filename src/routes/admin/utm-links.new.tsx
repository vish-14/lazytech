import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { getSupabaseAdmin } from "@/lib/supabase-admin.server";
import { toast } from "sonner";
import { ArrowLeft, Link as LinkIcon, RefreshCw } from "lucide-react";
import { getAdminSession } from "@/lib/auth.server";

const createUtmLink = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    const admin = await getAdminSession();
    if (!admin) throw new Error("Unauthorized");
    
    const supabase = getSupabaseAdmin();
    const { data: link, error } = await supabase
      .from("utm_links")
      .insert({
        ...data,
        created_by: admin.id
      })
      .select()
      .single();
      
    if (error) {
      if (error.code === '23505') throw new Error("Short code already exists");
      throw new Error("Failed to create link");
    }
    return link;
  });

export const Route = createFileRoute("/admin/utm-links/new")({
  component: NewUtmLink,
});

function generateShortCode() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function NewUtmLink() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    short_code: generateShortCode(),
    destination: "/build-ai-agents",
    product_type: "workshop-01",
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_content: "",
    utm_term: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createUtmLink({ data: formData });
      toast.success("Tracking link created successfully");
      navigate({ to: "/admin/utm-links" });
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Link to="/admin/utm-links" className="p-2 rounded-md hover:bg-[#F5F5F0]/10 text-[#F5F5F0]/70 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#F5F5F0]">New Tracking Link</h1>
          <p className="text-[#F5F5F0]/60 mt-1">Create a new promotional UTM link</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#111] border border-[#222] rounded-xl p-6 space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#F5F5F0]/70 mb-1">Campaign Name (Internal)</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. WhatsApp Builders Club — September"
              className="w-full rounded-md border border-[#333] bg-[#080808] px-3 py-2 text-[#F5F5F0] focus:border-[#E5092F] focus:outline-none focus:ring-1 focus:ring-[#E5092F]"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#F5F5F0]/70 mb-1">Destination URL path</label>
              <select
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                className="w-full rounded-md border border-[#333] bg-[#080808] px-3 py-2 text-[#F5F5F0] focus:border-[#E5092F] focus:outline-none focus:ring-1 focus:ring-[#E5092F]"
              >
                <option value="/build-ai-agents">/build-ai-agents</option>
                <option value="/join">/join</option>
                <option value="/">/ (Homepage)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#F5F5F0]/70 mb-1">Product Association</label>
              <select
                name="product_type"
                value={formData.product_type}
                onChange={handleChange}
                className="w-full rounded-md border border-[#333] bg-[#080808] px-3 py-2 text-[#F5F5F0] focus:border-[#E5092F] focus:outline-none focus:ring-1 focus:ring-[#E5092F]"
              >
                <option value="workshop-01">Workshop #01 (₹59)</option>
                <option value="lazypass">Lazy Pass (₹499)</option>
                <option value="">None</option>
              </select>
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-[#222]" />

        {/* UTM Parameters */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-[#F5F5F0]">UTM Parameters</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#F5F5F0]/70 mb-1">Source (Required)</label>
              <input
                type="text"
                name="utm_source"
                required
                value={formData.utm_source}
                onChange={handleChange}
                placeholder="e.g. whatsapp, instagram"
                className="w-full rounded-md border border-[#333] bg-[#080808] px-3 py-2 text-[#F5F5F0] focus:border-[#E5092F] focus:outline-none focus:ring-1 focus:ring-[#E5092F]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#F5F5F0]/70 mb-1">Medium</label>
              <input
                type="text"
                name="utm_medium"
                value={formData.utm_medium}
                onChange={handleChange}
                placeholder="e.g. group, reel, email"
                className="w-full rounded-md border border-[#333] bg-[#080808] px-3 py-2 text-[#F5F5F0] focus:border-[#E5092F] focus:outline-none focus:ring-1 focus:ring-[#E5092F]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#F5F5F0]/70 mb-1">Campaign</label>
              <input
                type="text"
                name="utm_campaign"
                value={formData.utm_campaign}
                onChange={handleChange}
                placeholder="e.g. sept-launch"
                className="w-full rounded-md border border-[#333] bg-[#080808] px-3 py-2 text-[#F5F5F0] focus:border-[#E5092F] focus:outline-none focus:ring-1 focus:ring-[#E5092F]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#F5F5F0]/70 mb-1">Content</label>
              <input
                type="text"
                name="utm_content"
                value={formData.utm_content}
                onChange={handleChange}
                placeholder="e.g. poster-v2"
                className="w-full rounded-md border border-[#333] bg-[#080808] px-3 py-2 text-[#F5F5F0] focus:border-[#E5092F] focus:outline-none focus:ring-1 focus:ring-[#E5092F]"
              />
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-[#222]" />

        {/* Short Link Generation */}
        <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#333]">
          <label className="block text-sm font-medium text-[#F5F5F0]/70 mb-2">Short URL Preview</label>
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center bg-[#080808] rounded-md border border-[#333] overflow-hidden">
              <span className="px-3 py-2 text-[#F5F5F0]/50 border-r border-[#333] bg-[#111]">
                lazytech.greatskills.co.in/r/
              </span>
              <input
                type="text"
                name="short_code"
                required
                value={formData.short_code}
                onChange={handleChange}
                className="flex-1 px-3 py-2 bg-transparent text-[#E5092F] font-mono focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => setFormData(p => ({ ...p, short_code: generateShortCode() }))}
              className="p-2 rounded-md border border-[#333] bg-[#111] hover:bg-[#222] transition-colors text-[#F5F5F0]/70"
              title="Generate new random code"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-md bg-[#E5092F] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#E5092F]/90 disabled:opacity-50"
          >
            {loading ? "Creating..." : (
              <>
                <LinkIcon className="h-4 w-4" />
                Create Tracking Link
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
