import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  try {
    // Create tables
    await supabaseAdmin.rpc("setup_ide_tables");

    // Insert default plugins
    await supabaseAdmin.rpc("setup_default_plugins");

    console.log("Database setup completed successfully");
  } catch (error) {
    console.error("Error setting up database:", error);
  }
}

setupDatabase();
