// src/lib/supabase/client.ts
import { createClient } from "@supabase/supabase-js";

// Ensure environment variables are set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables in client.");
}

// Initialize the client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);