import { createServerFn } from "@tanstack/react-start";
import { getSupabaseAdmin } from "./supabase-admin.server";
import { getCookie, setCookie } from "@tanstack/react-start/server";

export const getAdminSession = createServerFn({ method: "GET" }).handler(async () => {
  const sessionToken = getCookie("admin_session");
  if (!sessionToken) return null;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.auth.getUser(sessionToken);
  
  if (error || !data.user || data.user.app_metadata.role !== 'admin') {
    return null;
  }
  
  return data.user;
});

export const loginAdmin = createServerFn({ method: "POST" })
  .validator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    const supabase = getSupabaseAdmin();
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error || !authData.session) {
      throw new Error("Invalid credentials");
    }
    
    // Verify role
    const { data: user } = await supabase.auth.getUser(authData.session.access_token);
    if (user.user?.app_metadata.role !== 'admin') {
      throw new Error("Unauthorized");
    }

    setCookie("admin_session", authData.session.access_token, { path: '/', httpOnly: true, sameSite: 'lax', maxAge: 60 * 60 * 24 * 7 });
    return { success: true };
  });

export const logoutAdmin = createServerFn({ method: "POST" }).handler(async () => {
  setCookie("admin_session", "", { path: '/', httpOnly: true, sameSite: 'lax', maxAge: 0 });
  return { success: true };
});
