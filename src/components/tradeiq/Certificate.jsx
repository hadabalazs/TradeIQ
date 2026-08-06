import React, { useRef, useState, useEffect } from "react";
import { Download, Share2, Loader2, Check, Cloud } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { getCertificateForCourse } from "@/lib/certificates";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import Logo from "@/components/tradeiq/Logo";
import OrnateSeal from "@/components/tradeiq/OrnateSeal";

const LIGHT_VARS = {
  "--tiq-navy": "242 250 246",
  "--tiq-slate": "255 255 255",
  "--tiq-gold": "184 150 62",
  "--tiq-mint": "91 168 142",
  "--tiq-mintLight": "232 246 239",
  "--tiq-ink": "26 43 30",
  "--tiq-border": "213 232 222",
  "--tiq-prose-body": "74 90 78",
};

const GUILLOCHE_PATTERN = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">` +
  `<rect width="50" height="50" fill="#FBF8EF"/>` +
  `<circle cx="25" cy="25" r="23" fill="none" stroke="#B8963E" stroke-width="0.3" opacity="0.35"/>` +
  `<circle cx="25" cy="25" r="16" fill="none" stroke="#B8963E" stroke-width="0.3" opacity="0.3"/>` +
  `<circle cx="25" cy="25" r="9" fill="none" stroke="#B8963E" stroke-width="0.3" opacity="0.25"/>` +
  `<path d="M0,25 Q12.5,12.5 25,25 T50,25" fill="none" stroke="#5BA88E" stroke-width="0.35" opacity="0.22"/>` +
  `<path d="M0,25 Q12.5,37.5 25,25 T50,25" fill="none" stroke="#5BA88E" stroke-width="0.35" opacity="0.22"/>` +
  `<path d="M25,0 Q12.5,12.5 25,25 T25,50" fill="none" stroke="#5BA88E" stroke-width="0.35" opacity="0.22"/>` +
  `<path d="M25,0 Q37.5,12.5 25,25 T25,50" fill="none" stroke="#5BA88E" stroke-width="0.35" opacity="0.22"/>` +
  `<circle cx="0" cy="0" r="11" fill="none" stroke="#B8963E" stroke-width="0.25" opacity="0.2"/>` +
  `<circle cx="50" cy="0" r="11" fill="none" stroke="#B8963E" stroke-width="0.25" opacity="0.2"/>` +
  `<circle cx="0" cy="50" r="11" fill="none" stroke="#B8963E" stroke-width="0.25" opacity="0.2"/>` +
  `<circle cx="50" cy="50" r="11" fill="none" stroke="#B8963E" stroke-width="0.25" opacity="0.2"/>` +
  `</svg>`
)}`;

function CornerFlourish({ className = "" }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 2 L2 10 M2 2 L10 2" stroke="#B8963E" strokeWidth="0.7" opacity="0.5" />
      <path d="M2 2 Q9 3 11 8 M2 2 Q3 9 8 11" stroke="#B8963E" strokeWidth="0.4" opacity="0.35" fill="none" />
      <circle cx="2" cy="2" r="1.1" fill="#B8963E" opacity="0.4" />
    </svg>
  );
}

export default function Certificate({ course, name, score, date, preview = false }) {
  const { isAuthenticated, user } = useAuth();
  const certRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  // The certificate can carry a different name from the catalog — a formal
  // qualification title rather than the browsing title. Falls back to the course
  // title when not set, so renaming a course carries through by default.
  const courseName = course?.certificateTitle || course?.title || "TradeIQ Course";
  const certText = course?.certificateText || "has successfully completed the TradeIQ curriculum";

  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  // SECURITY: the id used to be a 32-bit hash of name + score + date — derivable
  // from a learner's details and prone to collisions. A real certificate id is
  // now issued server-side and looked up here; nothing is invented locally.
  //
  // When there is no issued certificate — a guest, offline, or before the
  // certificates migration is run — the certificate renders WITHOUT an id and
  // without a verification QR, rather than printing an id that would fail
  // verification. Showing an unverifiable id is worse than showing none.
  const [issued, setIssued] = useState(null);

  useEffect(() => {
    let alive = true;
    if (!isAuthenticated || !user?.id || !course?.id || preview) {
      setIssued(null);
      return () => { alive = false; };
    }
    getCertificateForCourse(user.id, course.id)
      .then((row) => alive && setIssued(row))
      .catch(() => alive && setIssued(null));
    return () => { alive = false; };
  }, [isAuthenticated, user?.id, course?.id, preview]);

  const certId = issued?.cert_id || null;
  const verifyUrl = certId ? `${window.location.origin}/verify/${certId}` : null;
  const qrUrl = verifyUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=72x72&margin=0&bgcolor=F5EDD8&color=1A2B1E&data=${encodeURIComponent(verifyUrl)}`
    : null;

  const handleDownload = async () => {
    if (!certRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        backgroundColor: "#FBF8EF",
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`TradeIQ_Certificate_${(name || "Learner").replace(/\s+/g, "_")}.pdf`);
    } catch (e) {
      console.error("PDF generation failed:", e);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    const shareText = `I earned my TradeIQ Certificate in ${courseName} with a score of ${score}%!`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "TradeIQ Certificate",
          text: shareText,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (e) {
      // user cancelled or error
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Certificate with guilloche border */}
      <div
        ref={certRef}
        style={{ ...LIGHT_VARS, backgroundImage: `url("${GUILLOCHE_PATTERN}")`, backgroundSize: "50px 50px" }}
        className="rounded-lg shadow-xl"
      >
        <div className="rounded-lg p-[14px]">
          {/* Inner cream area with thin gold border */}
          <div className="rounded-md bg-[#FEFDF8] border border-[#B8963E]/25 relative overflow-hidden">
            {/* Background watermark — guilloche rosette */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
              <svg width="400" height="400" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {Array.from({ length: 20 }).map((_, i) => (
                  <circle key={`wc${i}`} cx="50" cy="50" r={4 + i * 2.2} fill="none" stroke="#5BA88E" strokeWidth="0.15" />
                ))}
                {Array.from({ length: 36 }).map((_, i) => {
                  const a = (i * 10) * Math.PI / 180;
                  return (
                    <line key={`wl${i}`} x1="50" y1="50"
                      x2={50 + 45 * Math.cos(a)} y2={50 + 45 * Math.sin(a)}
                      stroke="#5BA88E" strokeWidth="0.08" opacity="0.5" />
                  );
                })}
              </svg>
            </div>

            {/* Corner flourishes */}
            <CornerFlourish className="absolute top-3 left-3" />
            <CornerFlourish className="absolute top-3 right-3 rotate-90" />
            <CornerFlourish className="absolute bottom-3 left-3 -rotate-90" />
            <CornerFlourish className="absolute bottom-3 right-3 rotate-180" />

            {/* Preview watermark */}
            {preview && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <span
                  className="font-slab font-bold text-[#B8963E] select-none"
                  style={{
                    fontSize: "6rem",
                    opacity: 0.10,
                    transform: "rotate(-30deg)",
                    letterSpacing: "0.15em",
                  }}
                >
                  PREVIEW
                </span>
              </div>
            )}

            {/* Content */}
            <div className="relative p-8 sm:p-12 text-center">
              {/* Header: logo + academy name */}
              <div className="flex items-center justify-center gap-2 mb-1">
                <Logo size={26} />
                <h2 className="font-slab text-base text-tiq-ink font-bold">TradeIQ Academy</h2>
              </div>
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="w-8 h-px bg-[#B8963E]/30" />
                <div className="w-1 h-1 rounded-full bg-[#B8963E]/40" />
                <div className="w-8 h-px bg-[#B8963E]/30" />
              </div>

              {/* Ornate seal */}
              <OrnateSeal size={84} className="mx-auto mb-4" />

              {/* Title */}
              <p className="text-[11px] tracking-[0.42em] text-tiq-mint uppercase mb-2 font-semibold">
                Certificate of Completion
              </p>
              <div className="flex items-center justify-center gap-2 mb-5">
                <div className="w-10 h-px bg-[#B8963E]/40" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#B8963E]/50" />
                <div className="w-10 h-px bg-[#B8963E]/40" />
              </div>

              {/* Recipient */}
              <p className="text-slate-500 text-sm mb-3 italic">This is to certify that</p>
              <p className="font-slab text-2xl sm:text-3xl text-[#B8963E] font-bold border-b border-[#B8963E]/30 inline-block px-8 pb-1 mb-4">
                {name || "Learner"}
              </p>

              {/* Course */}
              <p className="text-slate-500 text-sm mb-1">has successfully completed all requirements of the</p>
              <p className="font-slab text-lg text-tiq-ink font-bold mb-3">{courseName}</p>
              <p className="text-slate-600 text-xs max-w-md mx-auto mb-7 leading-relaxed">{certText}</p>

              {/* QR + Score + Date — aligned 3-column grid */}
              <div className="grid grid-cols-3 items-start max-w-lg mx-auto gap-4">
                {/* QR code + verify URL — only for an issued certificate, since a
                    QR pointing at an id that cannot be verified is worse than none. */}
                <div className="text-center">
                  {qrUrl ? (
                    <>
                      <img
                        src={qrUrl}
                        crossOrigin="anonymous"
                        alt="Scan to verify this certificate"
                        className="w-12 h-12 rounded-sm border border-[#B8963E]/20 mx-auto mb-1"
                      />
                      <p className="text-[8px] text-slate-500 uppercase tracking-wider">Scan to verify</p>
                      <p className="text-[9px] text-tiq-mint font-mono-tiq">{window.location.host}/verify</p>
                    </>
                  ) : (
                    <p className="text-[8px] text-slate-400 uppercase tracking-wider leading-relaxed">
                      Preview — sign in to issue a verifiable certificate
                    </p>
                  )}
                </div>

                {/* Score */}
                <div className="text-center">
                  <p className="text-[8px] text-slate-500 uppercase tracking-wider mb-1">Final Score</p>
                  <p className="font-mono-tiq text-xl text-tiq-ink font-bold mb-5">{score}%</p>
                </div>

                {/* Date */}
                <div className="text-center">
                  <p className="text-[8px] text-slate-500 uppercase tracking-wider mb-1">Date of Completion</p>
                  <p className="text-xs text-tiq-ink font-medium mb-5">{formattedDate}</p>
                </div>
              </div>

              {/* Signature line */}
              <div className="max-w-xs mx-auto pt-2">
                <div className="text-center">
                  <p className="font-slab text-tiq-ink text-xs italic mb-1">TradeIQ Academy</p>
                  <div className="w-full h-px bg-tiq-ink/30 mb-1" />
                  <p className="text-[8px] text-slate-500 uppercase tracking-wider">Issued By</p>
                </div>
              </div>

              {/* Certificate ID + accreditation */}
              <div className="mt-6 pt-4 border-t border-[#B8963E]/15">
                <p className="text-[9px] text-slate-400 font-mono-tiq tracking-wider">
                  {certId ? `Certificate ID: ${certId}` : "Not yet issued — preview only"}
                </p>
                <p className="text-[8px] text-slate-400 mt-1 italic">
                  TradeIQ Academy &middot; This certificate does not expire
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons — generating the certificate requires an account */}
      {isAuthenticated ? (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-tiq-mint text-white font-semibold hover:bg-tiq-mint/90 transition disabled:opacity-50"
          >
            {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {downloading ? "Generating..." : "Download PDF"}
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-tiq-border text-slate-600 hover:bg-tiq-mintLight transition font-medium"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            {copied ? "Link Copied!" : "Share"}
          </button>
        </div>
      ) : (
        <div className="mt-6 max-w-md mx-auto text-center p-4 rounded-xl bg-tiq-mintLight border border-tiq-border">
          <p className="text-sm text-slate-600 mb-3">
            <span className="font-semibold text-tiq-ink">Create a free account</span> to generate your
            official certificate PDF and keep your progress synced across devices.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-tiq-mint text-white font-semibold hover:bg-tiq-mint/90 transition text-sm"
          >
            <Cloud className="w-4 h-4" /> Sign up or sign in
          </Link>
        </div>
      )}
    </div>
  );
}