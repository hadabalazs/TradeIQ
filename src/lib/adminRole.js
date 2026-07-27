// Admin role check. The role lives in Supabase app_metadata, which only
// the project owner can set (dashboard/SQL) — users cannot grant it to themselves.
export function isAdminUser(user) {
  return user?.app_metadata?.role === "admin";
}
