import 'server-only'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Server-side Supabase client for weeks.cz.
// Reads camp data from the shared Supabase project (owned by weeks-hub).
// Uses service role key to bypass RLS — this client must NEVER be imported
// into client components. The `server-only` import will throw at build time
// if that happens.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let _client: ReturnType<typeof createClient> | null = null

export function getSupabase() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return null
  }
  if (!_client) {
    _client = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: { persistSession: false },
    })
  }
  return _client
}

// Throwing variant used by KV registration/payment routes that require Supabase
// to be configured. Returns untyped client (no Database generic) — KV tables
// are managed via raw migrations; full schema typing would belong in a follow-up.
export function createServerClient(): SupabaseClient {
  const client = getSupabase()
  if (!client) {
    throw new Error('Supabase credentials missing — registration/payment routes require NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars.')
  }
  return client as SupabaseClient
}
