import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { setSyncUser, pushToCloud, syncOnLogin } from '@/lib/sync';

// Hybrid auth: the app is fully usable as a guest (local-only).
// Signing in adds cross-device sync of progress via Supabase.

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const syncedUserRef = useRef(null);

  // Merge cloud<->local whenever a session appears (fresh login, app reload
  // while logged in, token refresh). Sync now MERGES rather than overwrites,
  // so this can never lose progress; we only reload if the merged result
  // actually added something to local state.
  const runSync = useCallback(async (userId) => {
    if (!userId || syncedUserRef.current === userId) return;
    syncedUserRef.current = userId;
    try {
      const result = await syncOnLogin(userId);
      if (result === 'merged-changed') window.location.reload();
    } catch { /* offline/transient — local stays intact */ }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const s = data.session || null;
      setSession(s);
      setSyncUser(s?.user?.id || null);
      setIsLoadingAuth(false);
      if (s?.user?.id) runSync(s.user.id);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession || null);
      const uid = newSession?.user?.id || null;
      setSyncUser(uid);
      if (uid) runSync(uid);
      else syncedUserRef.current = null;
    });
    return () => sub.subscription.unsubscribe();
  }, [runSync]);

  // When returning to the tab, push any pending local changes up and pull a
  // fresh merge — but only reload if the merge added something. No forced
  // mid-session reloads for no reason.
  useEffect(() => {
    const onVisible = async () => {
      if (document.visibilityState !== 'visible') return;
      const uid = session?.user?.id;
      if (!uid) return;
      try {
        await pushToCloud();
        const result = await syncOnLogin(uid);
        if (result === 'merged-changed') window.location.reload();
      } catch { /* ignore */ }
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [session]);

  const logout = useCallback(async () => {
    try { await pushToCloud(); } catch { /* best effort */ }
    await supabase.auth.signOut();
    setSyncUser(null);
    syncedUserRef.current = null;
    // Local data stays on the device; signing back in re-merges.
  }, []);

  const noop = useCallback(() => {}, []);

  return (
    <AuthContext.Provider value={{
      user: session?.user || null,
      isAuthenticated: !!session,
      isLoadingAuth,
      authChecked: !isLoadingAuth,
      authError: null,
      logout,
      navigateToLogin: noop,
      checkAppState: noop,
      checkUserAuth: noop,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
