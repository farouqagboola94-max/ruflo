import { createClient } from '@supabase/supabase-js'

// Publishable browser configuration. Database RLS enforces record access.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qeoqxowpnrmttjupxkeb.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_gHHp7ua9p8CS-gTGB9bTfQ_WBJoZPwB',
)
