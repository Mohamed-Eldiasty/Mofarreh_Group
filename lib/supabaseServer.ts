import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceRoleKey) {
  // service client requires server-only service role key
  console.warn('Supabase service client not configured (SUPABASE_SERVICE_ROLE_KEY missing)');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
