import { createClient } from '@supabase/supabase-js';

export const SUPABASE_PROJECT_ID = 'ixqdcghckwpgznvrguus';
export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://ixqdcghckwpgznvrguus.supabase.co';
export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_qEKK19YGduVlFCD-tg2xtg_vDx4c2ZH';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
