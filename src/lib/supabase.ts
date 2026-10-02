import { createClient } from "@supabase/supabase-js"

/**
 * Browser-side Supabase client. This is a static SPA, so the only key that may
 * ship here is the publishable key — row level security is what actually
 * protects the data, not the key.
 */
const url = import.meta.env.VITE_SUPABASE_URL
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!url || !publishableKey) {
  throw new Error(
    "Missing Supabase env vars. Copy .env.example to .env.local and set " +
      "VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY, then restart the dev server.",
  )
}

export const supabase = createClient(url, publishableKey)
