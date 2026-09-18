import { createFileRoute, Outlet, redirect, Link } from "@tanstack/react-router";
import { getAdminSession, logoutAdmin } from "@/lib/auth.server";
import { LogOut, BarChart3, Link as LinkIcon } from "lucide-react";
import { useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    const user = await getAdminSession();
    if (!user && location.pathname !== "/admin/login") {
      throw redirect({ to: "/admin/login" });
    }
    if (user && location.pathname === "/admin/login") {
      throw redirect({ to: "/admin/analytics" });
    }
    return { user };
  },
  component: AdminLayout,
});

function AdminLayout() {
  const { user } = Route.useRouteContext();
  const router = useRouter();

  if (!user) return <Outlet />;

  return (
    <div className="flex min-h-screen bg-[#080808] text-[#F5F5F0]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#F5F5F0]/10 flex flex-col">
        <div className="p-6">
          <Link to="/" className="text-xl font-bold tracking-tighter">
            LAZYTECH
          </Link>
          <div className="text-xs text-[#E5092F] font-mono mt-1">ADMIN PORTAL</div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link
            to="/admin/analytics"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-[#F5F5F0]/70 hover:text-[#F5F5F0] hover:bg-[#F5F5F0]/5 [&.active]:bg-[#F5F5F0]/10 [&.active]:text-[#F5F5F0]"
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Link>
          <Link
            to="/admin/utm-links"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-[#F5F5F0]/70 hover:text-[#F5F5F0] hover:bg-[#F5F5F0]/5 [&.active]:bg-[#F5F5F0]/10 [&.active]:text-[#F5F5F0]"
          >
            <LinkIcon className="h-4 w-4" />
            Tracking Links
          </Link>
        </nav>

        <div className="p-4 border-t border-[#F5F5F0]/10">
          <button
            onClick={async () => {
              await logoutAdmin();
              router.navigate({ to: "/admin/login" });
            }}
            className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-[#F5F5F0]/70 hover:text-[#F5F5F0] hover:bg-[#F5F5F0]/5"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
