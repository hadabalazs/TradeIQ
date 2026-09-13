import { supabase } from '@/lib/supabaseClient';

// Admin reads of user accounts, via the functions in migrations/008.
//
// Accounts live in auth.users, which the browser cannot read directly. Both
// functions check server-side that the caller is an admin, so these calls
// return nothing useful to anyone else — the admin gate in the UI is a
// convenience, not the protection.
//
// Every result carries a status so the page can tell apart three situations
// that would otherwise all look like "no users":
//   not_installed  the migration has not been run
//   forbidden      signed in, but the database does not see an admin role
//   error          anything else (offline, unexpected failure)

function classify(error) {
  if (!error) return 'ok';
  // PostgREST reports a missing function as PGRST202.
  if (error.code === 'PGRST202' || /could not find the function/i.test(error.message || '')) {
    return 'not_installed';
  }
  // Raised by the functions themselves with errcode 42501.
  if (error.code === '42501' || /admin only/i.test(error.message || '')) return 'forbidden';
  return 'error';
}

export async function listUsers() {
  const { data, error } = await supabase.rpc('admin_list_users');
  const status = classify(error);
  return { status, users: status === 'ok' ? data || [] : [], error };
}

export async function getUser(userId) {
  const { data, error } = await supabase.rpc('admin_get_user', { p_user_id: userId });
  const status = classify(error);
  if (status === 'ok' && !data) return { status: 'missing', user: null, error: null };
  return { status, user: status === 'ok' ? data : null, error };
}
