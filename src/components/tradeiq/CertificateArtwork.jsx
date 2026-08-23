import React from "react";
import Logo from "@/components/tradeiq/Logo";
import OrnateSeal from "@/components/tradeiq/OrnateSeal";

// The certificate artwork, in three layouts that share one visual language.
//
//   classic   the original wide certificate — what the app has always shown
//   portrait  A4 portrait, larger type, meta stacked. Readable on a phone and
//             the right shape for printing or attaching to an application.
//   square    1200×1200 for a LinkedIn post. Feed images are cropped toward a
//             square, so a wide certificate posted there loses its edges; this
//             one is composed for that crop from the start.
//
// Believability comes from restraint, not ornament: a real credential states who
// earned what, when, at what standard, and how to check it. Every layout keeps
// those four facts prominent and the verification route visible, and none of
// them invents an accreditation the platform doesn't have.

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

// Export canvas sizes. Both are generous enough that html2canvas at scale 2
// produces something that still looks sharp on a retina screen and in print.
export const VARIANT_SIZE = {
  classic: null,               // responsive on screen; captured at its rendered size
  portrait: { w: 1240, h: 1754 }, // A4 at ~150dpi
  square: { w: 1200, h: 1200 },   // LinkedIn feed
};

function CornerFlourish({ className = "", scale = 1 }) {
  const s = 28 * scale;
  return (
    <svg className={className} width={s} height={s} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 2 L2 10 M2 2 L10 2" stroke="#B8963E" strokeWidth="0.7" opacity="0.5" />
      <path d="M2 2 Q9 3 11 8 M2 2 Q3 9 8 11" stroke="#B8963E" strokeWidth="0.4" opacity="0.35" fill="none" />
      <circle cx="2" cy="2" r="1.1" fill="#B8963E" opacity="0.4" />
    </svg>
  );
}

function Rule({ w = 40, dot = 4 }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="h-px bg-[#B8963E]/40" style={{ width: w }} />
      <div className="rounded-full bg-[#B8963E]/50" style={{ width: dot, height: dot }} />
      <div className="h-px bg-[#B8963E]/40" style={{ width: w }} />
    </div>
  );
}

export default function CertificateArtwork({
  variant = "classic",
  name,
  courseName,
  certText,
  score,
  formattedDate,
  certId,
  qrUrl,
  isCertified,
  isAuthenticated,
  preview = false,
  verifyHost,
}) {
  const size = VARIANT_SIZE[variant];
  const big = variant !== "classic";

  // Type scale per layout. The export layouts are rendered at fixed pixel sizes
  // rather than with Tailwind's responsive classes, because html2canvas captures
  // a detached node where breakpoints don't apply.
  const T = {
    classic: { pad: null, seal: 84, kicker: 11, name: null, course: 18, body: 12, meta: 8, score: 20 },
    portrait: { pad: 72, seal: 150, kicker: 18, name: 60, course: 34, body: 19, meta: 14, score: 40 },
    square: { pad: 64, seal: 130, kicker: 16, name: 52, course: 30, body: 17, meta: 13, score: 36 },
  }[variant];

  const verification = qrUrl ? (
    <div className="text-center">
      <img
        src={qrUrl}
        crossOrigin="anonymous"
        alt="Scan to verify this certificate"
        className="rounded-sm border border-[#B8963E]/20 mx-auto mb-1"
        style={big ? { width: T.seal * 0.62, height: T.seal * 0.62 } : { width: 48, height: 48 }}
      />
      <p className="text-slate-500 uppercase tracking-wider" style={{ fontSize: big ? T.meta : 8 }}>
        Scan to verify
      </p>
      <p className="text-tiq-mint font-mono-tiq" style={{ fontSize: big ? T.meta : 9 }}>
        {verifyHost}/verify
      </p>
    </div>
  ) : (
    <p className="text-slate-400 uppercase tracking-wider leading-relaxed text-center" style={{ fontSize: big ? T.meta : 8 }}>
      {isCertified ? (isAuthenticated ? "Verification pending" : "Sign in to verify") : "Preview — not yet earned"}
    </p>
  );

  return (
    <div
      style={{
        ...LIGHT_VARS,
        backgroundImage: `url("${GUILLOCHE_PATTERN}")`,
        backgroundSize: "50px 50px",
        ...(size ? { width: size.w, height: size.h } : {}),
      }}
      className={size ? "" : "rounded-lg shadow-xl"}
    >
      <div style={{ padding: big ? 18 : 14, height: "100%" }} className={size ? "" : "rounded-lg"}>
        <div
          className="bg-[#FEFDF8] border border-[#B8963E]/25 relative overflow-hidden h-full"
          style={{ borderRadius: big ? 8 : 6 }}
        >
          {/* Guilloche rosette watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
            <svg width={big ? size.w * 0.8 : 400} height={big ? size.w * 0.8 : 400} viewBox="0 0 100 100" fill="none">
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

          <CornerFlourish className="absolute top-3 left-3" scale={big ? 1.8 : 1} />
          <CornerFlourish className="absolute top-3 right-3 rotate-90" scale={big ? 1.8 : 1} />
          <CornerFlourish className="absolute bottom-3 left-3 -rotate-90" scale={big ? 1.8 : 1} />
          <CornerFlourish className="absolute bottom-3 right-3 rotate-180" scale={big ? 1.8 : 1} />

          {preview && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <span
                className="font-slab font-bold text-[#B8963E] select-none"
                style={{ fontSize: big ? T.name * 2.2 : "6rem", opacity: 0.1, transform: "rotate(-30deg)", letterSpacing: "0.15em" }}
              >
                PREVIEW
              </span>
            </div>
          )}

          <div
            className={`relative text-center h-full flex flex-col ${big ? "justify-between" : ""}`}
            style={big ? { padding: T.pad } : {}}
          >
            {/* On the tall export canvases the main block takes the remaining
                height and centres itself. Pinning it to the top instead left a
                dead band through the middle of the portrait layout. */}
            <div className={big ? "flex-1 flex flex-col justify-center" : "p-8 sm:p-12"}>
              {/* Issuer */}
              <div className="flex items-center justify-center gap-2" style={{ marginBottom: big ? 6 : 4 }}>
                <Logo size={big ? 44 : 26} />
                <h2 className="font-slab text-tiq-ink font-bold" style={{ fontSize: big ? T.course : 16 }}>
                  TradeIQ Academy
                </h2>
              </div>
              <div style={{ marginBottom: big ? T.pad * 0.45 : 24 }}><Rule w={big ? 56 : 32} dot={big ? 6 : 4} /></div>

              <OrnateSeal size={T.seal} className="mx-auto" />

              <p
                className="text-tiq-mint uppercase font-semibold"
                style={{ fontSize: T.kicker, letterSpacing: "0.42em", margin: big ? `${T.pad * 0.3}px 0 ${T.pad * 0.18}px` : "16px 0 8px" }}
              >
                Certificate of Completion
              </p>
              <div style={{ marginBottom: big ? T.pad * 0.4 : 20 }}><Rule w={big ? 64 : 40} dot={big ? 7 : 6} /></div>

              {/* Recipient */}
              <p className="text-slate-500 italic" style={{ fontSize: big ? T.body : 14, marginBottom: big ? 12 : 12 }}>
                This is to certify that
              </p>
              <p
                // self-center so the underline hugs the name: as a flex child it
                // would otherwise stretch the full width of the certificate.
                className="font-slab text-[#B8963E] font-bold border-b border-[#B8963E]/30 inline-block self-center"
                style={
                  big
                    ? { fontSize: T.name, padding: `0 ${T.pad * 0.5}px ${T.pad * 0.08}px`, marginBottom: T.pad * 0.35 }
                    : { padding: "0 32px 4px", marginBottom: 16 }
                }
              >
                {name || "Learner"}
              </p>

              {/* Course */}
              <p className="text-slate-500" style={{ fontSize: big ? T.body : 14, marginBottom: big ? 10 : 4 }}>
                has successfully completed all requirements of the
              </p>
              <p className="font-slab text-tiq-ink font-bold" style={{ fontSize: T.course, marginBottom: big ? 14 : 12 }}>
                {courseName}
              </p>
              <p
                className="text-slate-600 mx-auto leading-relaxed"
                style={{ fontSize: big ? T.body * 0.85 : 12, maxWidth: big ? size.w * 0.7 : 448, marginBottom: big ? 0 : 28 }}
              >
                {certText}
              </p>
            </div>

            {/* Facts + verification. Stacked in the export layouts so nothing is
                squeezed, and so the QR stays large enough to scan from a phone
                screen rather than only from print. */}
            <div className={big ? "" : "px-8 sm:px-12 pb-8 sm:pb-12"}>
              <div
                className="grid grid-cols-3 items-start mx-auto"
                style={{ gap: big ? T.pad * 0.3 : 16, maxWidth: big ? size.w * 0.78 : 512, marginBottom: big ? T.pad * 0.35 : 8 }}
              >
                {verification}
                <div className="text-center">
                  <p className="text-slate-500 uppercase tracking-wider" style={{ fontSize: big ? T.meta : 8, marginBottom: 4 }}>
                    Final Score
                  </p>
                  <p className="font-mono-tiq text-tiq-ink font-bold" style={{ fontSize: T.score }}>{score}%</p>
                </div>
                <div className="text-center">
                  <p className="text-slate-500 uppercase tracking-wider" style={{ fontSize: big ? T.meta : 8, marginBottom: 4 }}>
                    Date of Completion
                  </p>
                  <p className="text-tiq-ink font-medium" style={{ fontSize: big ? T.body : 12 }}>{formattedDate}</p>
                </div>
              </div>

              <div className="mx-auto" style={{ maxWidth: big ? size.w * 0.42 : 320 }}>
                <p className="font-slab text-tiq-ink italic" style={{ fontSize: big ? T.body : 12, marginBottom: 4 }}>
                  TradeIQ Academy
                </p>
                <div className="w-full h-px bg-tiq-ink/30" style={{ marginBottom: 4 }} />
                <p className="text-slate-500 uppercase tracking-wider" style={{ fontSize: big ? T.meta : 8 }}>Issued By</p>
              </div>

              <div style={{ marginTop: big ? T.pad * 0.35 : 24, paddingTop: big ? 14 : 16, borderTop: "1px solid rgba(184,150,62,0.15)" }}>
                <p className="text-slate-400 font-mono-tiq tracking-wider" style={{ fontSize: big ? T.meta : 9 }}>
                  {certId
                    ? `Certificate ID: ${certId}`
                    : isCertified
                    ? isAuthenticated ? "Certificate ID pending — reconnect to issue" : "Sign in to issue a verifiable certificate ID"
                    : "Preview only — not yet earned"}
                </p>
                <p className="text-slate-400 italic" style={{ fontSize: big ? T.meta * 0.9 : 8, marginTop: 4 }}>
                  TradeIQ Academy &middot; This certificate does not expire
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
