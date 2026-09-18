import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { loginAdmin } from "@/lib/auth.server";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await loginAdmin({ data: { email, password } });
      toast.success("Welcome back");
      router.navigate({ to: "/admin/analytics" });
    } catch (err) {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#080808] px-4 font-sans">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tighter text-[#F5F5F0]">LAZYTECH</h1>
          <p className="text-[#E5092F] font-mono text-sm mt-2">ADMIN PORTAL</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#F5F5F0]/70 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border border-[#F5F5F0]/20 bg-[#080808] px-3 py-2 text-[#F5F5F0] placeholder:text-[#F5F5F0]/30 focus:border-[#E5092F] focus:outline-none focus:ring-1 focus:ring-[#E5092F]"
              placeholder="admin@lazytech.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#F5F5F0]/70 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md border border-[#F5F5F0]/20 bg-[#080808] px-3 py-2 text-[#F5F5F0] placeholder:text-[#F5F5F0]/30 focus:border-[#E5092F] focus:outline-none focus:ring-1 focus:ring-[#E5092F]"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[#E5092F] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#E5092F]/90 disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
