import { createClient } from '@supabase/supabase-js'
import { Database } from './supabase-types'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './constants'

// Initialize the Supabase client
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: false
  }
});

// Log initialization for debugging
console.log("Supabase client initialized with URL:", SUPABASE_URL);
