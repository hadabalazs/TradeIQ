import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { setSyncUser, pushToCloud } from '@/lib/sync';

// Hybrid auth: the app is fully usable as a guest (local-only).
// Signing in adds cross-device sync of progress via Supabase.

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session || null);
      setSyncUser(data.session?.user?.id || null);
      setIsLoadingAuth(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession || null);
      setSyncUser(newSession?.user?.id || null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const logout = useCallback(async () => {
    try { await pushToCloud(); } catch { /* best effort */ }
    await supabase.auth.signOut();
    setSyncUser(null);
    // Local data stays on the device; signing back in re-syncs.
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
