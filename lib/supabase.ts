import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Only create client if env vars are set
let supabaseClient: SupabaseClient | null = null;

if (supabaseUrl && supabaseKey && supabaseUrl.startsWith("http")) {
  supabaseClient = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export const supabase = supabaseClient;

// Storage bucket name
export const STORAGE_BUCKET = "lubab-images";

// Helper to check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return supabaseClient !== null;
}
