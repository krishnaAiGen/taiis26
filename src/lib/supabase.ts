import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/**
 * Browser-side Supabase client. This is a static SPA, so the only key that may
 * ship here is the publishable key — row level security is what actually
 * protects the data, not the key.
 *
 * The client is created on first use rather than at import time. Throwing at
 * module scope would take the entire conference site down — venue, committees,
 * call for papers and all — because a registration environment variable was
 * missing. Only registration should break.
 */
const url = import.meta.env.VITE_SUPABASE_URL
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

/** False when the deployment has no Supabase credentials configured. */
export const supabaseConfigured = Boolean(url && publishableKey)

export const SUPABASE_CONFIG_ERROR =
  "Missing Supabase configuration. Set VITE_SUPABASE_URL and " +
  "VITE_SUPABASE_PUBLISHABLE_KEY in the deployment environment (or .env.local), " +
  "then rebuild."

let client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!supabaseConfigured) throw new Error(SUPABASE_CONFIG_ERROR)
  client ??= createClient(url, publishableKey)
  return client
}
