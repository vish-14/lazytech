import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const url = process.env["VITE_SUPABASE_URL"];
const key = process.env["LAZYTECH_SUPABASE_SERVICE_ROLE_KEY"];

if (!url || !key) {
  console.error("Missing environment variables");
  process.exit(1);
}

const supabaseAdmin = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: "kakkirenivishwas@gmail.com",
    password: "Nani@1409",
    email_confirm: true,
  });

  if (error) {
    if (error.message.includes("User already registered")) {
      console.log("Admin user already exists. Updating password...");
      const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      if (listError) throw listError;
      
      const adminUser = usersData.users.find(u => u.email === "kakkirenivishwas@gmail.com");
      if (adminUser) {
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(adminUser.id, {
          password: "Nani@1409",
          app_metadata: { role: 'admin' }
        });
        if (updateError) {
          console.error("Failed to update admin:", updateError);
        } else {
          console.log("Admin user updated successfully.");
        }
      }
    } else {
      console.error("Error creating admin:", error);
    }
  } else {
    // Set custom claim for admin
    if (data.user) {
      await supabaseAdmin.auth.admin.updateUserById(data.user.id, {
        app_metadata: { role: 'admin' }
      });
      console.log("Admin user created successfully:", data.user.id);
    }
  }
}

main().catch(console.error);
