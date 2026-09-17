import { createClient } from "@supabase/supabase-js";

export function getSupabaseAdmin() {
  const url = process.env["VITE_SUPABASE_URL"];
  const key = process.env["LAZYTECH_SUPABASE_SERVICE_ROLE_KEY"];

  if (!url) throw new Error("Missing VITE_SUPABASE_URL");
  if (!key) throw new Error("Missing LAZYTECH_SUPABASE_SERVICE_ROLE_KEY");

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
