import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShieldCheck, ShieldX, ShieldAlert, CheckCircle2, Award, Loader2 } from "lucide-react";
import Logo from "@/components/tradeiq/Logo";
import { verifyCertificate } from "@/lib/certificates";

// SECURITY: this page previously rendered "Certificate Verified — this is a
// valid certificate issued by TradeIQ Academy" for ANY id, without performing a
// lookup of any kind. A credential could be fabricated by inventing a string.
// It now resolves the id against issued certificates and states plainly when it
// cannot confirm one — an unverifiable id must never be presented as valid.
export default function Verify() {
  const { certId } = useParams();
  const [state, setState] = useState({ status: "loading" });

  useEffect(() => {
    let alive = true;
    verifyCertificate(certId)
      .then((r) => alive && setState(r))
      .catch(() => alive && setState({ status: "unavailable" }));
    return () => { alive = false; };
  }, [certId]);

  const shell = (children) => (
    <div className="min-h-screen flex items-center justify-center bg-tiq-navy p-6">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl border border-tiq-border p-8 sm:p-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Logo size={28} />
          <h1 className="font-slab text-lg text-tiq-ink font-bold">TradeIQ Academy</h1>
        </div>
        {children}
        <div className="pt-6 mt-6 border-t border-tiq-border">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-tiq-mint text-white font-semibold text-sm hover:bg-tiq-mint/90 transition"
          >
            Explore TradeIQ Courses
          </Link>
        </div>
      </div>
    </div>
  );

  if (state.status === "loading") {
    return shell(
      <>
        <Loader2 className="w-10 h-10 text-tiq-mint animate-spin mx-auto mb-4" />
        <p className="text-sm text-slate-500">Checking this certificate…</p>
      </>
    );
  }

  if (state.status === "valid") {
    const c = state.certificate;
    return shell(
      <>
        <div className="w-20 h-20 rounded-full bg-tiq-mintLight flex items-center justify-center mx-auto mb-5">
          <ShieldCheck className="w-10 h-10 text-tiq-mint" />
        </div>
        <h2 className="font-slab text-2xl text-tiq-ink font-bold mb-2">Certificate Verified</h2>
        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          This certificate was issued by TradeIQ Academy and is recorded in our register.
        </p>

        <dl className="text-left rounded-lg border border-tiq-border bg-tiq-mintLight/40 divide-y divide-tiq-border mb-6">
          {[
            ["Awarded to", c.learner_name],
            ["Course", c.course_title],
            ["Final score", `${c.score}%`],
            ["Issued", new Date(c.issued_at).toLocaleDateString()],
          ].map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between gap-3 px-4 py-2.5">
              <dt className="text-xs text-slate-500 uppercase tracking-wider shrink-0">{label}</dt>
              <dd className="text-sm text-tiq-ink font-medium text-right">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-tiq-mintLight border border-tiq-border mb-6">
          <span className="text-xs text-slate-500 uppercase tracking-wider">Certificate ID</span>
          <span className="text-sm font-mono-tiq text-tiq-ink font-semibold">{c.cert_id}</span>
        </div>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-sm text-tiq-mint">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-medium">Valid</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-tiq-mint">
            <Award className="w-4 h-4" />
            <span className="font-medium">Does Not Expire</span>
          </div>
        </div>
      </>
    );
  }

  if (state.status === "unavailable") {
    return shell(
      <>
        <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-5">
          <ShieldAlert className="w-10 h-10 text-amber-500" />
        </div>
        <h2 className="font-slab text-2xl text-tiq-ink font-bold mb-2">Couldn't check right now</h2>
        <p className="text-slate-600 text-sm leading-relaxed">
          The certificate register is unreachable, so this certificate can't be confirmed
          at the moment. This is <span className="font-medium">not</span> a statement that it
          is invalid — please try again shortly.
        </p>
      </>
    );
  }

  return shell(
    <>
      <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-5">
        <ShieldX className="w-10 h-10 text-red-500" />
      </div>
      <h2 className="font-slab text-2xl text-tiq-ink font-bold mb-2">Certificate not found</h2>
      <p className="text-slate-600 text-sm mb-4 leading-relaxed">
        No certificate with this ID has been issued by TradeIQ Academy. If you were given
        this link, treat it as unverified.
      </p>
      {certId && (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-tiq-mintLight border border-tiq-border">
          <span className="text-xs text-slate-500 uppercase tracking-wider">Checked ID</span>
          <span className="text-sm font-mono-tiq text-slate-600">{certId}</span>
        </div>
      )}
    </>
  );
}
