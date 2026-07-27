import React from "react";

const SEAL_TEXT = "TRADEIQ ACADEMY \u00B7 PROFESSIONAL CERTIFICATION \u00B7 ";

export default function OrnateSeal({ size = 88, className = "" }) {
  const cx = 50, cy = 50;
  const outerR = 47;
  const textR = 37;
  const innerR = 30;
  const starOuter = 13;
  const starInner = 5.5;

  const beads = Array.from({ length: 48 }, (_, i) => {
    const a = (i * 7.5) * Math.PI / 180;
    return { x: cx + outerR * Math.cos(a), y: cy + outerR * Math.sin(a) };
  });

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

  const rays = Array.from({ length: 24 }, (_, i) => {
    const a = (i * 15) * Math.PI / 180;
    return {
      x1: cx + (innerR - 2) * Math.cos(a),
      y1: cy + (innerR - 2) * Math.sin(a),
      x2: cx + (innerR - 5) * Math.cos(a),
      y2: cy + (innerR - 5) * Math.sin(a),
    };
  });

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sealGold" cx="38%" cy="32%">
          <stop offset="0%" stopColor="#EBC878" />
          <stop offset="45%" stopColor="#B8963E" />
          <stop offset="100%" stopColor="#8A6B2E" />
        </radialGradient>
        <radialGradient id="sealInner" cx="38%" cy="32%">
          <stop offset="0%" stopColor="#FBF5E4" />
          <stop offset="100%" stopColor="#EEDFB8" />
        </radialGradient>
      </defs>

      {/* Outer gold disc */}
      <circle cx={cx} cy={cy} r={outerR} fill="url(#sealGold)" stroke="#8A6B2E" strokeWidth="0.5" />

      {/* Beaded border */}
      {beads.map((b, i) => (
        <circle key={`b${i}`} cx={b.x} cy={b.y} r="0.85" fill="#704F1E" opacity="0.55" />
      ))}

      {/* Inner ring lines */}
      <circle cx={cx} cy={cy} r={outerR - 3.5} fill="none" stroke="#704F1E" strokeWidth="0.35" opacity="0.45" />
      <circle cx={cx} cy={cy} r={outerR - 5.5} fill="none" stroke="#704F1E" strokeWidth="0.25" opacity="0.35" />

      {/* Circular text */}
      {chars.map((char, i) => {
        const angle = (i / chars.length) * 360;
        const rad = (angle - 90) * Math.PI / 180;
        const x = cx + textR * Math.cos(rad);
        const y = cy + textR * Math.sin(rad);
        return (
          <text key={`t${i}`} x={x} y={y} fontSize="2.8" fill="#4A3514" fontWeight="600"
            textAnchor="middle" dominantBaseline="central"
            transform={`rotate(${angle} ${x} ${y})`}>
            {char}
          </text>
        );
      })}

      {/* Inner border before center disc */}
      <circle cx={cx} cy={cy} r={innerR + 2.5} fill="none" stroke="#704F1E" strokeWidth="0.4" opacity="0.5" />

      {/* Center cream disc */}
      <circle cx={cx} cy={cy} r={innerR} fill="url(#sealInner)" stroke="#B8963E" strokeWidth="0.5" />

      {/* Star burst rays */}
      {rays.map((r, i) => (
        <line key={`r${i}`} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
          stroke="#B8963E" strokeWidth="0.3" opacity="0.28" />
      ))}

      {/* Center star */}
      <path d={starPath} fill="#B8963E" opacity="0.88" />
      <path d={starPath} fill="none" stroke="#704F1E" strokeWidth="0.3" />

      {/* Tiny center dot */}
      <circle cx={cx} cy={cy} r="1.2" fill="#704F1E" opacity="0.5" />
    </svg>
  );
}