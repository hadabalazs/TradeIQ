import { createClient } from '@supabase/supabase-js';

// Publishable values — safe to ship in frontend code.
// Row-level security on the server is what protects each user's data.
const SUPABASE_URL = 'https://wpxfqwmdvszugcykvkoe.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_qU0p-_i5CuK4yWwp99Jihg_TyWLfHxT';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
