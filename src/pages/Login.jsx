import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Cloud, Loader2, Mail, Lock } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { syncOnLogin } from "@/lib/sync";
import Logo from "@/components/tradeiq/Logo";

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("signin"); // signin | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      if (mode === "signup") {
        const { data, error: err } = await supabase.auth.signUp({ email, password });
        if (err) throw err;
        if (!data.session) {
          setInfo("Check your email to confirm your account, then sign in.");
          setBusy(false);
          return;
        }
        const result = await syncOnLogin(data.session.user.id);
        if (result === "merged-changed") { window.location.href = "/"; return; }
      } else {
        const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        const result = await syncOnLogin(data.session.user.id);
        if (result === "merged-changed") { window.location.href = "/"; return; }
      }
      navigate("/");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-tiq-navy flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-tiq-ink">
            <ArrowLeft className="w-4 h-4" /> Back to courses
          </Link>
        </div>

        <div className="rounded-2xl bg-white border border-tiq-border p-8">
          <div className="flex flex-col items-center text-center mb-6">
            <Logo size={48} />
            <h1 className="font-slab text-2xl text-tiq-ink font-bold mt-3">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
              <Cloud className="w-3.5 h-3.5 text-tiq-mint" />
              Sync your progress across devices
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-tiq-border bg-white pl-9 pr-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-tiq-mint/60"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-tiq-border bg-white pl-9 pr-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-tiq-mint/60"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
            )}
            {info && (
              <p className="text-sm text-tiq-mint bg-tiq-mint/10 border border-tiq-mint/30 rounded-lg px-3 py-2">{info}</p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-tiq-mint text-white font-semibold hover:bg-tiq-mint/90 transition disabled:opacity-50"
            >
              {busy && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === "signin" ? "Sign In" : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            {mode === "signin" ? (
              <>No account?{" "}
                <button onClick={() => { setMode("signup"); setError(null); }} className="text-tiq-mint font-medium hover:underline">
                  Sign up
                </button>
              </>
            ) : (
              <>Already registered?{" "}
                <button onClick={() => { setMode("signin"); setError(null); }} className="text-tiq-mint font-medium hover:underline">
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          You can use TradeIQ without an account — progress stays on this device only.
        </p>
      </div>
    </div>
  );
}
