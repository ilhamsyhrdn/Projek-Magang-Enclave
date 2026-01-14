import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Inisialisasi Client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'himatif', 
  },
});

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  db: { schema: 'himatif' }
})
