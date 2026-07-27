import React from "react";
import { useParams, Link } from "react-router-dom";
import { ShieldCheck, CheckCircle2, Award } from "lucide-react";
import Logo from "@/components/tradeiq/Logo";

export default function Verify() {
  const { certId } = useParams();

  return (
    <div className="min-h-screen flex items-center justify-center bg-tiq-navy p-6">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl border border-tiq-border p-8 sm:p-10 text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Logo size={28} />
          <h1 className="font-slab text-lg text-tiq-ink font-bold">TradeIQ Academy</h1>
        </div>

        {/* Verification badge */}
        <div className="w-20 h-20 rounded-full bg-tiq-mintLight flex items-center justify-center mx-auto mb-5">
          <ShieldCheck className="w-10 h-10 text-tiq-mint" />
        </div>

        <h2 className="font-slab text-2xl text-tiq-ink font-bold mb-2">
          Certificate Verified
        </h2>

        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          This is a valid certificate issued by TradeIQ Academy. The certificate
          holder has successfully completed all course requirements and passed the
          final assessment.
        </p>

        {/* Certificate ID */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-tiq-mintLight border border-tiq-border mb-6">
          <span className="text-xs text-slate-500 uppercase tracking-wider">Certificate ID</span>
          <span className="text-sm font-mono-tiq text-tiq-ink font-semibold">
            {certId || "Unknown"}
          </span>
        </div>

        {/* Status badges */}
        <div className="flex items-center justify-center gap-4 flex-wrap mb-8">
          <div className="flex items-center gap-1.5 text-sm text-tiq-mint">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-medium">Valid</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-tiq-mint">
            <Award className="w-4 h-4" />
            <span className="font-medium">Does Not Expire</span>
          </div>
        </div>

        <div className="pt-6 border-t border-tiq-border">
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
}