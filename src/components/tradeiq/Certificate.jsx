import React, { useRef, useState, useEffect } from "react";
import { Download, Share2, Loader2, Check, Cloud, Smartphone, Image as ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { useProgress } from "@/lib/ProgressContext";
import { getCertificateForCourse, issueCertificate } from "@/lib/certificates";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import CertificateArtwork, { VARIANT_SIZE } from "@/components/tradeiq/CertificateArtwork";
import { qrDataUri } from "@/lib/qrcode";

export default function Certificate({ course, name, score, date, preview = false }) {
  const { isAuthenticated, user } = useAuth();
  const { progress } = useProgress();
  // The certificate is real once the course is certified — `preview` is the
  // caller saying "this is a mock-up", not a statement about entitlement.
  const isCertified = !!progress?.courses?.[course?.id]?.certified;
  const certRef = useRef(null);
  const portraitRef = useRef(null);
  const squareRef = useRef(null);
  // Which format is generating, so only that button shows a spinner.
  const [downloading, setDownloading] = useState(null);
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

  // Issuance originally fired only at the moment the final assessment was
  // passed, which left anyone already certified — or certified before the
  // certificates table existed — permanently without a record, and their
  // certificate stuck reading "preview". Viewing an earned certificate now
  // issues one if it is missing, so the record heals itself wherever the
  // certificate is shown: course dashboard, My Achievements, or the results
  // screen.
  useEffect(() => {
    let alive = true;
    if (!isAuthenticated || !user?.id || !course?.id || preview || !isCertified) {
      setIssued(null);
      return () => { alive = false; };
    }
    (async () => {
      const existing = await getCertificateForCourse(user.id, course.id);
      if (!alive) return;
      if (existing) { setIssued(existing); return; }
      const certId = await issueCertificate({
        userId: user.id,
        courseId: course.id,
        courseTitle: course.certificateTitle || course.title,
        learnerName: name || user.email?.split("@")[0] || "Learner",
      });
      if (alive && certId) setIssued({ cert_id: certId });
    })().catch(() => { /* offline or table absent — falls back below */ });
    return () => { alive = false; };
  }, [isAuthenticated, user?.id, course?.id, preview, isCertified, name, score]);

  const certId = issued?.cert_id || null;
  const verifyUrl = certId ? `${window.location.origin}/verify/${certId}` : null;
  // Generated locally rather than fetched from api.qrserver.com. Sending each
  // certificate id to a third party to have it drawn is a disclosure a
  // credential should not make, and it left PDF export dependent on that
  // service being up.
  const qrUrl = verifyUrl ? qrDataUri(verifyUrl) : null;

  // Three formats from one design.
  //   classic   the wide certificate, as before
  //   portrait  A4 portrait PDF — readable on a phone, prints without scaling
  //   square    1200×1200 JPEG for a LinkedIn post
  //
  // JPEG rather than PNG for the social image: LinkedIn re-encodes uploads
  // anyway, and a photographic-quality JPEG is a fraction of the size, which
  // matters when someone is posting from a phone.
  const handleDownload = async (variant) => {
    const node =
      variant === "portrait" ? portraitRef.current :
      variant === "square" ? squareRef.current :
      certRef.current;
    if (!node) return;

    setDownloading(variant);
    try {
      const size = VARIANT_SIZE[variant];
      const canvas = await html2canvas(node, {
        scale: 2,
        backgroundColor: "#FBF8EF",
        useCORS: true,
        logging: false,
        ...(size ? { width: size.w, height: size.h, windowWidth: size.w, windowHeight: size.h } : {}),
      });
      const safeName = (name || "Learner").replace(/\s+/g, "_");

      if (variant === "square") {
        const jpeg = canvas.toDataURL("image/jpeg", 0.92);
        const a = document.createElement("a");
        a.href = jpeg;
        a.download = `TradeIQ_Certificate_${safeName}_LinkedIn.jpg`;
        a.click();
        return;
      }

      const pdf = new jsPDF({
        orientation: canvas.width >= canvas.height ? "landscape" : "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`TradeIQ_Certificate_${safeName}${variant === "portrait" ? "_Portrait" : ""}.pdf`);
    } catch (e) {
      console.error("Certificate export failed:", e);
    } finally {
      setDownloading(null);
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

  const artProps = {
    name,
    courseName,
    certText,
    score,
    formattedDate,
    certId,
    qrUrl,
    isCertified,
    isAuthenticated,
    preview,
    verifyHost: typeof window !== "undefined" ? window.location.host : "",
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div ref={certRef}>
        <CertificateArtwork variant="classic" {...artProps} />
      </div>

      {/* Export layouts, rendered off-screen at their exact pixel size.
          html2canvas captures a live node, so the alternate formats have to
          exist in the document — but they must never affect the visible page,
          hence fixed positioning far off-canvas rather than display:none, which
          would give them no dimensions to capture. */}
      <div aria-hidden="true" style={{ position: "fixed", left: -20000, top: 0, pointerEvents: "none", opacity: 0 }}>
        <div ref={portraitRef}><CertificateArtwork variant="portrait" {...artProps} /></div>
        <div ref={squareRef}><CertificateArtwork variant="square" {...artProps} /></div>
      </div>

      {/* Action buttons — generating the certificate requires an account */}
      {isAuthenticated ? (
        <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
          <button
            onClick={() => handleDownload("classic")}
            disabled={!!downloading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-tiq-mint text-white font-semibold hover:bg-tiq-mint/90 transition disabled:opacity-50"
          >
            {downloading === "classic" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {downloading === "classic" ? "Generating…" : "PDF — wide"}
          </button>
          <button
            onClick={() => handleDownload("portrait")}
            disabled={!!downloading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-tiq-border text-slate-700 font-medium hover:bg-tiq-mintLight transition disabled:opacity-50"
            title="A4 portrait — reads well on a phone and prints cleanly"
          >
            {downloading === "portrait" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Smartphone className="w-4 h-4" />}
            {downloading === "portrait" ? "Generating…" : "PDF — portrait"}
          </button>
          <button
            onClick={() => handleDownload("square")}
            disabled={!!downloading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-tiq-border text-slate-700 font-medium hover:bg-tiq-mintLight transition disabled:opacity-50"
            title="1200×1200 JPEG, composed for a LinkedIn post"
          >
            {downloading === "square" ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
            {downloading === "square" ? "Generating…" : "JPEG — for LinkedIn"}
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