import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl) {
  throw new Error(
    'Missing VITE_SUPABASE_URL — configure it in your .env file.',
  )
}

if (!supabasePublishableKey) {
  throw new Error(
    'Missing VITE_SUPABASE_PUBLISHABLE_KEY — configure it in your .env file.',
  )
}

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey,
)