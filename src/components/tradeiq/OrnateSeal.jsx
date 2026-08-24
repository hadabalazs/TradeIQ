import React from "react";

// The gold certification seal.
//
// This renders as an <img> carrying a data-URI SVG rather than as inline SVG,
// and that is load-bearing rather than stylistic.
//
// html2canvas — which produces every certificate download — clones the page and
// stamps the full computed style inline on every cloned node. For an inline SVG
// that means all ~128 elements of this seal (every bead, ray, and per-character
// <text> node) each acquire a ~10KB style attribute, taking the serialised SVG
// from 20KB to ~1.3MB. html2canvas then serialises that into a data URI and
// loads it as an image; at that size the image fails to decode, the failure is
// swallowed, and the seal is silently absent from the exported PDF/JPEG. It
// looked correct on screen the whole time, which is why it went unnoticed.
//
// Wrapping the markup in a data URI puts it out of the cloner's reach: the
// bytes inside the URI cannot be rewritten, so what exports is exactly what
// renders. It also scopes the gradient ids to the image, so the three
// certificate layouts that are mounted at once no longer share `#sealGold`.
const SEAL_TEXT = "TRADEIQ ACADEMY · PROFESSIONAL CERTIFICATION · ";

const SEAL_SVG = (() => {
  const cx = 50, cy = 50;
  const outerR = 47;
  const textR = 37;
  const innerR = 30;
  const starOuter = 13;
  const starInner = 5.5;

  const beads = Array.from({ length: 48 }, (_, i) => {
    const a = (i * 7.5) * Math.PI / 180;
    return `<circle cx="${(cx + outerR * Math.cos(a)).toFixed(2)}" cy="${(cy + outerR * Math.sin(a)).toFixed(2)}" r="0.85" fill="#704F1E" opacity="0.55"/>`;
  }).join("");

  let starPath = "";
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? starOuter : starInner;
    const a = (i * 36 - 90) * Math.PI / 180;
    const x = cx + r * Math.cos(a);
    const y = cy + r * Math.sin(a);
    starPath += i === 0 ? `M${x.toFixed(2)},${y.toFixed(2)}` : ` L${x.toFixed(2)},${y.toFixed(2)}`;
  }
  starPath += " Z";

  const chars = SEAL_TEXT.split("");
  const circularText = chars.map((char, i) => {
    const angle = (i / chars.length) * 360;
    const rad = (angle - 90) * Math.PI / 180;
    const x = cx + textR * Math.cos(rad);
    const y = cy + textR * Math.sin(rad);
    // & < > must be escaped for the markup to stay well-formed XML.
    const safe = char.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `<text x="${x.toFixed(2)}" y="${y.toFixed(2)}" font-size="2.8" fill="#4A3514" font-weight="600" text-anchor="middle" dominant-baseline="central" transform="rotate(${angle.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)})">${safe}</text>`;
  }).join("");

  const rays = Array.from({ length: 24 }, (_, i) => {
    const a = (i * 15) * Math.PI / 180;
    return `<line x1="${(cx + (innerR - 2) * Math.cos(a)).toFixed(2)}" y1="${(cy + (innerR - 2) * Math.sin(a)).toFixed(2)}" x2="${(cx + (innerR - 5) * Math.cos(a)).toFixed(2)}" y2="${(cy + (innerR - 5) * Math.sin(a)).toFixed(2)}" stroke="#B8963E" stroke-width="0.3" opacity="0.28"/>`;
  }).join("");

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" fill="none">` +
      `<defs>` +
        `<radialGradient id="sealGold" cx="38%" cy="32%">` +
          `<stop offset="0%" stop-color="#EBC878"/>` +
          `<stop offset="45%" stop-color="#B8963E"/>` +
          `<stop offset="100%" stop-color="#8A6B2E"/>` +
        `</radialGradient>` +
        `<radialGradient id="sealInner" cx="38%" cy="32%">` +
          `<stop offset="0%" stop-color="#FBF5E4"/>` +
          `<stop offset="100%" stop-color="#EEDFB8"/>` +
        `</radialGradient>` +
      `</defs>` +
      // Outer gold disc
      `<circle cx="${cx}" cy="${cy}" r="${outerR}" fill="url(#sealGold)" stroke="#8A6B2E" stroke-width="0.5"/>` +
      // Beaded border
      beads +
      // Inner ring lines
      `<circle cx="${cx}" cy="${cy}" r="${outerR - 3.5}" fill="none" stroke="#704F1E" stroke-width="0.35" opacity="0.45"/>` +
      `<circle cx="${cx}" cy="${cy}" r="${outerR - 5.5}" fill="none" stroke="#704F1E" stroke-width="0.25" opacity="0.35"/>` +
      // Circular text
      circularText +
      // Inner border before centre disc
      `<circle cx="${cx}" cy="${cy}" r="${innerR + 2.5}" fill="none" stroke="#704F1E" stroke-width="0.4" opacity="0.5"/>` +
      // Centre cream disc
      `<circle cx="${cx}" cy="${cy}" r="${innerR}" fill="url(#sealInner)" stroke="#B8963E" stroke-width="0.5"/>` +
      // Star burst rays
      rays +
      // Centre star
      `<path d="${starPath}" fill="#B8963E" opacity="0.88"/>` +
      `<path d="${starPath}" fill="none" stroke="#704F1E" stroke-width="0.3"/>` +
      // Tiny centre dot
      `<circle cx="${cx}" cy="${cy}" r="1.2" fill="#704F1E" opacity="0.5"/>` +
    `</svg>`
  );
})();

export const SEAL_DATA_URI = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(SEAL_SVG)}`;

export default function OrnateSeal({ size = 88, className = "" }) {
  return (
    <img
      src={SEAL_DATA_URI}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      draggable={false}
      className={className}
      // Explicit dimensions in CSS as well as attributes: html2canvas measures
      // the used size, and a bare <img> in a flex column would otherwise be a
      // shrinkable item.
      style={{ width: size, height: size, flexShrink: 0 }}
    />
  );
}
