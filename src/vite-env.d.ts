/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string
  readonly VITE_REGISTRATION_TABLE: string
  readonly VITE_PAYMENT_ENABLED: string
  readonly VITE_SHOW_TEST_CATEGORY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
