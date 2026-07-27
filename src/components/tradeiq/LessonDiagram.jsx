import React from "react";

// A collection of SVG diagrams rendered inline within lessons.
// Each diagram is keyed by type and styled with the app's tiq color palette.

const DIAGRAMS = {
  // ===== OPEN FINANCE DIAGRAMS =====

  scope_comparison: () => (
    <svg viewBox="0 0 520 360" className="w-full max-w-lg mx-auto my-4">
      {/* Open Data (outer) */}
      <circle cx="260" cy="180" r="160" fill="rgb(var(--tiq-gold) / 0.08)" stroke="rgb(var(--tiq-gold) / 0.4)" strokeWidth="2" />
      <text x="260" y="35" textAnchor="middle" className="font-slab" fontSize="13" fontWeight="700" fill="rgb(var(--tiq-gold))">Open Data</text>
      <text x="260" y="52" textAnchor="middle" fontSize="10" fill="rgb(var(--tiq-prose-body))">Telecoms · Energy · Utilities · Gov</text>
      {/* Open Finance (middle) */}
      <circle cx="260" cy="180" r="110" fill="rgb(var(--tiq-mint) / 0.1)" stroke="rgb(var(--tiq-mint) / 0.5)" strokeWidth="2" />
      <text x="260" y="90" textAnchor="middle" className="font-slab" fontSize="13" fontWeight="700" fill="rgb(var(--tiq-mint))">Open Finance</text>
      <text x="260" y="106" textAnchor="middle" fontSize="10" fill="rgb(var(--tiq-prose-body))">+ Investments, Loans, Insurance</text>
      {/* Open Banking (inner) */}
      <circle cx="260" cy="185" r="60" fill="rgb(var(--tiq-mint) / 0.2)" stroke="rgb(var(--tiq-mint) / 0.7)" strokeWidth="2" />
      <text x="260" y="180" textAnchor="middle" className="font-slab" fontSize="13" fontWeight="700" fill="rgb(var(--tiq-ink))">Open Banking</text>
      <text x="260" y="196" textAnchor="middle" fontSize="10" fill="rgb(var(--tiq-prose-body))">Payment accounts</text>
    </svg>
  ),

  ecosystem_stakeholders: () => (
    <svg viewBox="0 0 520 300" className="w-full max-w-lg mx-auto my-4">
      {/* Customer */}
      <rect x="20" y="120" width="100" height="60" rx="10" fill="rgb(var(--tiq-mint) / 0.15)" stroke="rgb(var(--tiq-mint) / 0.5)" strokeWidth="2" />
      <text x="70" y="148" textAnchor="middle" fontSize="12" fontWeight="700" fill="rgb(var(--tiq-ink))">Customer</text>
      <text x="70" y="164" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">Data Owner</text>
      {/* LFI */}
      <rect x="200" y="30" width="120" height="55" rx="10" fill="rgb(var(--tiq-gold) / 0.1)" stroke="rgb(var(--tiq-gold) / 0.4)" strokeWidth="2" />
      <text x="260" y="55" textAnchor="middle" fontSize="12" fontWeight="700" fill="rgb(var(--tiq-ink))">LFI (Bank)</text>
      <text x="260" y="70" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">Holds accounts · APIs</text>
      {/* API Hub */}
      <rect x="200" y="120" width="120" height="60" rx="10" fill="rgb(var(--tiq-mint) / 0.2)" stroke="rgb(var(--tiq-mint) / 0.6)" strokeWidth="2" />
      <text x="260" y="148" textAnchor="middle" fontSize="12" fontWeight="700" fill="rgb(var(--tiq-ink))">API Hub</text>
      <text x="260" y="164" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">Operated by Nebras</text>
      {/* TPP */}
      <rect x="400" y="120" width="100" height="60" rx="10" fill="rgb(var(--tiq-gold) / 0.1)" stroke="rgb(var(--tiq-gold) / 0.4)" strokeWidth="2" />
      <text x="450" y="148" textAnchor="middle" fontSize="12" fontWeight="700" fill="rgb(var(--tiq-ink))">TPP</text>
      <text x="450" y="164" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">AISP / PISP</text>
      {/* Regulator */}
      <rect x="200" y="230" width="120" height="55" rx="10" fill="rgb(var(--tiq-gold) / 0.1)" stroke="rgb(var(--tiq-gold) / 0.4)" strokeWidth="2" />
      <text x="260" y="255" textAnchor="middle" fontSize="12" fontWeight="700" fill="rgb(var(--tiq-ink))">CBUAE</text>
      <text x="260" y="270" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">Regulator</text>
      {/* Arrows */}
      <line x1="120" y1="140" x2="200" y2="80" stroke="rgb(var(--tiq-mint) / 0.5)" strokeWidth="1.5" markerEnd="url(#arrow)" />
      <text x="155" y="100" fontSize="9" fill="rgb(var(--tiq-mint))" fontWeight="600">consent</text>
      <line x1="260" y1="85" x2="260" y2="120" stroke="rgb(var(--tiq-mint) / 0.5)" strokeWidth="1.5" markerEnd="url(#arrow)" />
      <line x1="320" y1="150" x2="400" y2="150" stroke="rgb(var(--tiq-mint) / 0.5)" strokeWidth="1.5" markerEnd="url(#arrow)" />
      <line x1="260" y1="180" x2="260" y2="230" stroke="rgb(var(--tiq-mint) / 0.5)" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#arrow)" />
      <line x1="120" y1="160" x2="200" y2="150" stroke="rgb(var(--tiq-mint) / 0.3)" strokeWidth="1.5" markerEnd="url(#arrow)" />
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="rgb(var(--tiq-mint) / 0.6)" />
        </marker>
      </defs>
    </svg>
  ),

  api_hub_architecture: () => (
    <svg viewBox="0 0 520 280" className="w-full max-w-lg mx-auto my-4">
      <text x="130" y="20" textAnchor="middle" fontSize="11" fontWeight="700" fill="rgb(var(--tiq-prose-body))">Without Hub (EU/UK model)</text>
      {/* Banks left */}
      {[40, 90, 140].map((y, i) => (
        <g key={i}>
          <rect x="10" y={y} width="70" height="32" rx="6" fill="rgb(var(--tiq-gold) / 0.1)" stroke="rgb(var(--tiq-gold) / 0.3)" strokeWidth="1.5" />
          <text x="45" y={y + 20} textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-ink))">Bank {i + 1}</text>
        </g>
      ))}
      {/* TPPs right */}
      {[40, 90, 140].map((y, i) => (
        <g key={i}>
          <rect x="180" y={y} width="70" height="32" rx="6" fill="rgb(var(--tiq-mint) / 0.1)" stroke="rgb(var(--tiq-mint) / 0.3)" strokeWidth="1.5" />
          <text x="215" y={y + 20} textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-ink))">TPP {i + 1}</text>
        </g>
      ))}
      {/* Many-to-many lines */}
      {[55, 105, 155].flatMap((y1) =>
        [55, 105, 155].map((y2, j) => (
          <line key={`${y1}-${j}`} x1="80" y1={y1} x2="180" y2={y2} stroke="rgb(var(--tiq-mint) / 0.25)" strokeWidth="1" />
        ))
      )}

      {/* Divider */}
      <line x1="260" y1="10" x2="260" y2="270" stroke="rgb(var(--tiq-border))" strokeWidth="1.5" strokeDasharray="4 4" />

      <text x="390" y="20" textAnchor="middle" fontSize="11" fontWeight="700" fill="rgb(var(--tiq-prose-body))">With API Hub (UAE model)</text>
      {/* Banks right side */}
      {[40, 90, 140].map((y, i) => (
        <g key={i}>
          <rect x="270" y={y} width="65" height="32" rx="6" fill="rgb(var(--tiq-gold) / 0.1)" stroke="rgb(var(--tiq-gold) / 0.3)" strokeWidth="1.5" />
          <text x="302" y={y + 20} textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-ink))">Bank {i + 1}</text>
          <line x1="335" y1={y + 16} x2="370" y2="95" stroke="rgb(var(--tiq-mint) / 0.4)" strokeWidth="1.5" />
        </g>
      ))}
      {/* Hub center */}
      <circle cx="390" cy="95" r="28" fill="rgb(var(--tiq-mint) / 0.2)" stroke="rgb(var(--tiq-mint) / 0.6)" strokeWidth="2" />
      <text x="390" y="92" textAnchor="middle" fontSize="9" fontWeight="700" fill="rgb(var(--tiq-ink))">API</text>
      <text x="390" y="103" textAnchor="middle" fontSize="9" fontWeight="700" fill="rgb(var(--tiq-ink))">Hub</text>
      {/* TPPs far right */}
      {[40, 90, 140].map((y, i) => (
        <g key={i}>
          <rect x="440" y={y} width="65" height="32" rx="6" fill="rgb(var(--tiq-mint) / 0.1)" stroke="rgb(var(--tiq-mint) / 0.3)" strokeWidth="1.5" />
          <text x="472" y={y + 20} textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-ink))">TPP {i + 1}</text>
          <line x1="440" y1={y + 16} x2="415" y2="95" stroke="rgb(var(--tiq-mint) / 0.4)" strokeWidth="1.5" />
        </g>
      ))}
      <text x="390" y="200" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-mint))" fontWeight="600">One connection each</text>
    </svg>
  ),

  oauth_consent_flow: () => (
    <svg viewBox="0 0 520 340" className="w-full max-w-lg mx-auto my-4">
      {/* Actors header */}
      <text x="80" y="20" textAnchor="middle" fontSize="11" fontWeight="700" fill="rgb(var(--tiq-mint))">TPP</text>
      <text x="260" y="20" textAnchor="middle" fontSize="11" fontWeight="700" fill="rgb(var(--tiq-gold))">Customer</text>
      <text x="440" y="20" textAnchor="middle" fontSize="11" fontWeight="700" fill="rgb(var(--tiq-mint))">Bank (LFI)</text>
      {/* Lifelines */}
      <line x1="80" y1="30" x2="80" y2="330" stroke="rgb(var(--tiq-border))" strokeWidth="1.5" strokeDasharray="3 3" />
      <line x1="260" y1="30" x2="260" y2="330" stroke="rgb(var(--tiq-border))" strokeWidth="1.5" strokeDasharray="3 3" />
      <line x1="440" y1="30" x2="440" y2="330" stroke="rgb(var(--tiq-border))" strokeWidth="1.5" strokeDasharray="3 3" />
      {/* Messages */}
      {[
        { y: 55, x1: 80, x2: 260, label: "1. Redirect to bank for auth", color: "rgb(var(--tiq-mint))" },
        { y: 85, x1: 260, x2: 440, label: "2. Login + consent (SCA)", color: "rgb(var(--tiq-gold))" },
        { y: 115, x1: 440, x2: 260, label: "3. Redirect back with code", color: "rgb(var(--tiq-mint))" },
        { y: 145, x1: 260, x2: 80, label: "", color: "rgb(var(--tiq-mint))" },
        { y: 175, x1: 80, x2: 440, label: "4. Exchange code for token", color: "rgb(var(--tiq-mint))" },
        { y: 205, x1: 440, x2: 80, label: "5. Access token returned", color: "rgb(var(--tiq-mint))" },
        { y: 235, x1: 80, x2: 440, label: "6. API call with token", color: "rgb(var(--tiq-mint))" },
        { y: 265, x1: 440, x2: 80, label: "7. JSON data response", color: "rgb(var(--tiq-mint))" },
      ].map((m, i) => (
        <g key={i}>
          <line x1={m.x1} y1={m.y} x2={m.x2} y2={m.y} stroke={m.color} strokeWidth="1.5" markerEnd="url(#arrow2)" />
          {m.label && (
            <text x={(m.x1 + m.x2) / 2} y={m.y - 6} textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))" fontWeight="600">
              {m.label}
            </text>
          )}
        </g>
      ))}
      <text x="170" y="143" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))" fontWeight="600">(code to TPP)</text>
      <defs>
        <marker id="arrow2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="rgb(var(--tiq-mint) / 0.6)" />
        </marker>
      </defs>
    </svg>
  ),

  sca_factors: () => (
    <svg viewBox="0 0 400 280" className="w-full max-w-sm mx-auto my-4">
      {/* Knowledge */}
      <circle cx="150" cy="110" r="75" fill="rgb(var(--tiq-mint) / 0.15)" stroke="rgb(var(--tiq-mint) / 0.5)" strokeWidth="2" />
      <text x="150" y="70" textAnchor="middle" fontSize="12" fontWeight="700" fill="rgb(var(--tiq-mint))">Something you</text>
      <text x="150" y="85" textAnchor="middle" fontSize="12" fontWeight="700" fill="rgb(var(--tiq-mint))">KNOW</text>
      <text x="150" y="100" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">Password · PIN</text>
      {/* Possession */}
      <circle cx="250" cy="110" r="75" fill="rgb(var(--tiq-gold) / 0.12)" stroke="rgb(var(--tiq-gold) / 0.4)" strokeWidth="2" />
      <text x="250" y="70" textAnchor="middle" fontSize="12" fontWeight="700" fill="rgb(var(--tiq-gold))">Something you</text>
      <text x="250" y="85" textAnchor="middle" fontSize="12" fontWeight="700" fill="rgb(var(--tiq-gold))">HAVE</text>
      <text x="250" y="100" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">Phone · Token</text>
      {/* Inherence */}
      <circle cx="200" cy="180" r="75" fill="rgb(var(--tiq-mint) / 0.15)" stroke="rgb(var(--tiq-mint) / 0.5)" strokeWidth="2" />
      <text x="200" y="220" textAnchor="middle" fontSize="12" fontWeight="700" fill="rgb(var(--tiq-mint))">Something you</text>
      <text x="200" y="235" textAnchor="middle" fontSize="12" fontWeight="700" fill="rgb(var(--tiq-mint))">ARE</text>
      <text x="200" y="250" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">Fingerprint · Face</text>
      {/* SCA label in center */}
      <text x="200" y="140" textAnchor="middle" fontSize="11" fontWeight="700" fill="rgb(var(--tiq-ink))">SCA =</text>
      <text x="200" y="155" textAnchor="middle" fontSize="10" fill="rgb(var(--tiq-prose-body))">2+ factors</text>
    </svg>
  ),

  service_initiation: () => (
    <svg viewBox="0 0 500 200" className="w-full max-w-lg mx-auto my-4">
      {/* Payment Initiation box */}
      <rect x="20" y="40" width="200" height="120" rx="10" fill="rgb(var(--tiq-mint) / 0.1)" stroke="rgb(var(--tiq-mint) / 0.4)" strokeWidth="2" />
      <text x="120" y="70" textAnchor="middle" fontSize="12" fontWeight="700" fill="rgb(var(--tiq-mint))">Payment Initiation</text>
      <text x="120" y="92" textAnchor="middle" fontSize="10" fill="rgb(var(--tiq-prose-body))">• Checkout</text>
      <text x="120" y="108" textAnchor="middle" fontSize="10" fill="rgb(var(--tiq-prose-body))">• Bill payment</text>
      <text x="120" y="124" textAnchor="middle" fontSize="10" fill="rgb(var(--tiq-prose-body))">• P2P transfers</text>
      <text x="120" y="148" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))" fontStyle="italic">(PSD2 / UK standard)</text>

      {/* Arrow */}
      <path d="M230 100 L270 100" stroke="rgb(var(--tiq-mint) / 0.6)" strokeWidth="2" markerEnd="url(#arrow3)" />
      <text x="250" y="92" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-mint))" fontWeight="600">UAE extends</text>

      {/* Service Initiation box */}
      <rect x="280" y="20" width="200" height="160" rx="10" fill="rgb(var(--tiq-gold) / 0.1)" stroke="rgb(var(--tiq-gold) / 0.4)" strokeWidth="2" />
      <text x="380" y="48" textAnchor="middle" fontSize="12" fontWeight="700" fill="rgb(var(--tiq-gold))">Service Initiation</text>
      <text x="380" y="68" textAnchor="middle" fontSize="10" fill="rgb(var(--tiq-prose-body))">All of the left, plus:</text>
      <text x="380" y="88" textAnchor="middle" fontSize="10" fill="rgb(var(--tiq-prose-body))">• Investment orders</text>
      <text x="380" y="104" textAnchor="middle" fontSize="10" fill="rgb(var(--tiq-prose-body))">• Insurance applications</text>
      <text x="380" y="120" textAnchor="middle" fontSize="10" fill="rgb(var(--tiq-prose-body))">• Loan applications</text>
      <text x="380" y="136" textAnchor="middle" fontSize="10" fill="rgb(var(--tiq-prose-body))">• Savings automation</text>
      <text x="380" y="165" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))" fontStyle="italic">(UAE-specific · embedded finance)</text>
      <defs>
        <marker id="arrow3" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="rgb(var(--tiq-mint) / 0.6)" />
        </marker>
      </defs>
    </svg>
  ),

  // ===== IFRS DIAGRAMS =====

  ifrs15_steps: () => (
    <svg viewBox="0 0 520 100" className="w-full max-w-lg mx-auto my-4">
      {[
        { x: 10, label: "1. Identify", sub: "the contract" },
        { x: 110, label: "2. Identify", sub: "obligations" },
        { x: 210, label: "3. Determine", sub: "price" },
        { x: 310, label: "4. Allocate", sub: "price" },
        { x: 410, label: "5. Recognise", sub: "revenue" },
      ].map((s, i) => (
        <g key={i}>
          {i < 4 && (
            <line x1={s.x + 80} y1="35" x2={s.x + 100} y2="35" stroke="rgb(var(--tiq-mint) / 0.5)" strokeWidth="2" markerEnd="url(#arrow4)" />
          )}
          <rect x={s.x} y="10" width="90" height="50" rx="8" fill="rgb(var(--tiq-mint) / 0.1)" stroke="rgb(var(--tiq-mint) / 0.4)" strokeWidth="1.5" />
          <text x={s.x + 45} y="30" textAnchor="middle" fontSize="10" fontWeight="700" fill="rgb(var(--tiq-ink))">{s.label}</text>
          <text x={s.x + 45} y="45" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">{s.sub}</text>
        </g>
      ))}
      <text x="260" y="85" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-mint))" fontWeight="600">IFRS 15 — 5-Step Revenue Model</text>
      <defs>
        <marker id="arrow4" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="rgb(var(--tiq-mint) / 0.6)" />
        </marker>
      </defs>
    </svg>
  ),

  incoterms_risk_transfer: () => (
    <svg viewBox="0 0 520 220" className="w-full max-w-lg mx-auto my-4">
      {/* Journey line */}
      <line x1="30" y1="120" x2="490" y2="120" stroke="rgb(var(--tiq-border))" strokeWidth="3" />
      {/* Seller side */}
      <rect x="10" y="50" width="60" height="30" rx="6" fill="rgb(var(--tiq-mint) / 0.1)" stroke="rgb(var(--tiq-mint) / 0.3)" strokeWidth="1.5" />
      <text x="40" y="70" textAnchor="middle" fontSize="10" fontWeight="700" fill="rgb(var(--tiq-ink))">Seller</text>
      {/* Buyer side */}
      <rect x="450" y="50" width="60" height="30" rx="6" fill="rgb(var(--tiq-gold) / 0.1)" stroke="rgb(var(--tiq-gold) / 0.3)" strokeWidth="1.5" />
      <text x="480" y="70" textAnchor="middle" fontSize="10" fontWeight="700" fill="rgb(var(--tiq-ink))">Buyer</text>
      {/* Port icons */}
      <text x="130" y="105" textAnchor="middle" fontSize="22">🚢</text>
      <text x="130" y="145" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">Load Port</text>
      <text x="380" y="105" textAnchor="middle" fontSize="22">🏭</text>
      <text x="380" y="145" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">Destination</text>
      {/* Risk transfer markers */}
      {/* FOB */}
      <line x1="130" y1="100" x2="130" y2="180" stroke="rgb(var(--tiq-mint))" strokeWidth="2" strokeDasharray="3 2" />
      <circle cx="130" cy="120" r="5" fill="rgb(var(--tiq-mint))" />
      <rect x="100" y="180" width="60" height="30" rx="6" fill="rgb(var(--tiq-mint) / 0.15)" stroke="rgb(var(--tiq-mint) / 0.5)" strokeWidth="1.5" />
      <text x="130" y="200" textAnchor="middle" fontSize="10" fontWeight="700" fill="rgb(var(--tiq-mint))">FOB</text>
      {/* CIF */}
      <circle cx="255" cy="120" r="5" fill="rgb(var(--tiq-gold))" />
      <rect x="225" y="180" width="60" height="30" rx="6" fill="rgb(var(--tiq-gold) / 0.1)" stroke="rgb(var(--tiq-gold) / 0.4)" strokeWidth="1.5" />
      <text x="255" y="200" textAnchor="middle" fontSize="10" fontWeight="700" fill="rgb(var(--tiq-gold))">CFR/CIF</text>
      <text x="255" y="170" textAnchor="middle" fontSize="8" fill="rgb(var(--tiq-prose-body))">risk still at load</text>
      {/* DAP */}
      <line x1="380" y1="100" x2="380" y2="180" stroke="rgb(var(--tiq-mint))" strokeWidth="2" strokeDasharray="3 2" />
      <circle cx="380" cy="120" r="5" fill="rgb(var(--tiq-mint))" />
      <rect x="350" y="180" width="60" height="30" rx="6" fill="rgb(var(--tiq-mint) / 0.15)" stroke="rgb(var(--tiq-mint) / 0.5)" strokeWidth="1.5" />
      <text x="380" y="200" textAnchor="middle" fontSize="10" fontWeight="700" fill="rgb(var(--tiq-mint))">DAP</text>
      {/* Labels */}
      <text x="255" y="40" textAnchor="middle" fontSize="9" fontWeight="600" fill="rgb(var(--tiq-prose-body))">← Risk with Seller</text>
    </svg>
  ),

  cash_flow_hedge_flow: () => (
    <svg viewBox="0 0 520 240" className="w-full max-w-lg mx-auto my-4">
      {/* Derivative */}
      <rect x="20" y="100" width="110" height="50" rx="8" fill="rgb(var(--tiq-gold) / 0.1)" stroke="rgb(var(--tiq-gold) / 0.4)" strokeWidth="1.5" />
      <text x="75" y="122" textAnchor="middle" fontSize="10" fontWeight="700" fill="rgb(var(--tiq-ink))">Derivative</text>
      <text x="75" y="138" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">fair value change</text>
      {/* Split arrow */}
      <line x1="130" y1="115" x2="180" y2="70" stroke="rgb(var(--tiq-mint) / 0.5)" strokeWidth="1.5" markerEnd="url(#arrow5)" />
      <text x="140" y="85" fontSize="9" fill="rgb(var(--tiq-mint))" fontWeight="600">effective</text>
      <line x1="130" y1="135" x2="180" y2="170" stroke="rgb(var(--tiq-gold) / 0.5)" strokeWidth="1.5" markerEnd="url(#arrow5b)" />
      <text x="140" y="165" fontSize="9" fill="rgb(var(--tiq-gold))" fontWeight="600">ineffective</text>
      {/* OCI */}
      <rect x="180" y="40" width="110" height="50" rx="8" fill="rgb(var(--tiq-mint) / 0.12)" stroke="rgb(var(--tiq-mint) / 0.5)" strokeWidth="1.5" />
      <text x="235" y="62" textAnchor="middle" fontSize="10" fontWeight="700" fill="rgb(var(--tiq-ink))">OCI</text>
      <text x="235" y="78" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">hedge reserve</text>
      {/* P&L immediate */}
      <rect x="180" y="150" width="110" height="50" rx="8" fill="rgb(var(--tiq-gold) / 0.1)" stroke="rgb(var(--tiq-gold) / 0.4)" strokeWidth="1.5" />
      <text x="235" y="172" textAnchor="middle" fontSize="10" fontWeight="700" fill="rgb(var(--tiq-ink))">P&L</text>
      <text x="235" y="188" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">immediately</text>
      {/* Reclassify arrow */}
      <line x1="290" y1="65" x2="380" y2="120" stroke="rgb(var(--tiq-mint) / 0.5)" strokeWidth="1.5" markerEnd="url(#arrow5)" />
      <text x="325" y="85" fontSize="9" fill="rgb(var(--tiq-mint))" fontWeight="600">reclassify</text>
      <text x="335" y="98" fontSize="8" fill="rgb(var(--tiq-prose-body))">when sale recognised</text>
      {/* P&L final */}
      <rect x="380" y="95" width="120" height="50" rx="8" fill="rgb(var(--tiq-mint) / 0.12)" stroke="rgb(var(--tiq-mint) / 0.5)" strokeWidth="1.5" />
      <text x="440" y="117" textAnchor="middle" fontSize="10" fontWeight="700" fill="rgb(var(--tiq-ink))">P&L</text>
      <text x="440" y="133" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">matched to revenue</text>
      <defs>
        <marker id="arrow5" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="rgb(var(--tiq-mint) / 0.6)" />
        </marker>
        <marker id="arrow5b" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="rgb(var(--tiq-gold) / 0.5)" />
        </marker>
      </defs>
    </svg>
  ),

  supply_chain_flow: () => (
    <svg viewBox="0 0 520 200" className="w-full max-w-lg mx-auto my-4">
      {/* Main flow */}
      <rect x="10" y="70" width="90" height="50" rx="8" fill="rgb(var(--tiq-mint) / 0.1)" stroke="rgb(var(--tiq-mint) / 0.4)" strokeWidth="1.5" />
      <text x="55" y="92" textAnchor="middle" fontSize="10" fontWeight="700" fill="rgb(var(--tiq-ink))">Producer</text>
      <text x="55" y="108" textAnchor="middle" fontSize="8" fill="rgb(var(--tiq-prose-body))">Mine</text>

      <line x1="100" y1="95" x2="130" y2="95" stroke="rgb(var(--tiq-mint) / 0.5)" strokeWidth="2" markerEnd="url(#arrow6)" />

      <rect x="130" y="70" width="90" height="50" rx="8" fill="rgb(var(--tiq-gold) / 0.1)" stroke="rgb(var(--tiq-gold) / 0.4)" strokeWidth="1.5" />
      <text x="175" y="92" textAnchor="middle" fontSize="10" fontWeight="700" fill="rgb(var(--tiq-ink))">Trading</text>
      <text x="175" y="108" textAnchor="middle" fontSize="8" fill="rgb(var(--tiq-prose-body))">House</text>

      <line x1="220" y1="95" x2="250" y2="95" stroke="rgb(var(--tiq-mint) / 0.5)" strokeWidth="2" markerEnd="url(#arrow6)" />

      <rect x="250" y="70" width="90" height="50" rx="8" fill="rgb(var(--tiq-mint) / 0.1)" stroke="rgb(var(--tiq-mint) / 0.4)" strokeWidth="1.5" />
      <text x="295" y="92" textAnchor="middle" fontSize="10" fontWeight="700" fill="rgb(var(--tiq-ink))">Offtaker</text>
      <text x="295" y="108" textAnchor="middle" fontSize="8" fill="rgb(var(--tiq-prose-body))">End-user</text>

      <line x1="340" y1="95" x2="370" y2="95" stroke="rgb(var(--tiq-mint) / 0.5)" strokeWidth="2" markerEnd="url(#arrow6)" />

      <rect x="370" y="70" width="90" height="50" rx="8" fill="rgb(var(--tiq-gold) / 0.1)" stroke="rgb(var(--tiq-gold) / 0.4)" strokeWidth="1.5" />
      <text x="415" y="92" textAnchor="middle" fontSize="10" fontWeight="700" fill="rgb(var(--tiq-ink))">Market</text>
      <text x="415" y="108" textAnchor="middle" fontSize="8" fill="rgb(var(--tiq-prose-body))">Consumer</text>

      {/* Supporting services */}
      <text x="175" y="30" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">Inspection (SGS · Intertek)</text>
      <text x="175" y="155" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">Logistics (Transnet · Shipping)</text>
      <text x="295" y="30" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">Banks (LC · Trade Finance)</text>
      <text x="295" y="155" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">Compliance (KYC · Sanctions)</text>
      <defs>
        <marker id="arrow6" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="rgb(var(--tiq-mint) / 0.6)" />
        </marker>
      </defs>
    </svg>
  ),

  // ===== ADDITIONAL ILLUSTRATIVE DIAGRAMS =====

  commodity_types: () => (
    <svg viewBox="0 0 480 240" className="w-full max-w-lg mx-auto my-4">
      {/* Thermal coal */}
      <rect x="15" y="30" width="135" height="75" rx="10" fill="rgb(var(--tiq-mint) / 0.1)" stroke="rgb(var(--tiq-mint) / 0.4)" strokeWidth="1.5" />
      <text x="82" y="52" textAnchor="middle" fontSize="11" fontWeight="700" fill="rgb(var(--tiq-ink))">Thermal Coal</text>
      <text x="82" y="68" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-mint))">⚡ Power generation</text>
      <text x="82" y="82" textAnchor="middle" fontSize="8" fill="rgb(var(--tiq-prose-body))">Priced off API4</text>
      <text x="82" y="96" textAnchor="middle" fontSize="8" fill="rgb(var(--tiq-prose-body))">FOB Richards Bay</text>
      {/* Coking coal */}
      <rect x="170" y="30" width="135" height="75" rx="10" fill="rgb(var(--tiq-gold) / 0.1)" stroke="rgb(var(--tiq-gold) / 0.4)" strokeWidth="1.5" />
      <text x="237" y="52" textAnchor="middle" fontSize="11" fontWeight="700" fill="rgb(var(--tiq-ink))">Coking Coal</text>
      <text x="237" y="68" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-gold))">🔧 Steelmaking</text>
      <text x="237" y="82" textAnchor="middle" fontSize="8" fill="rgb(var(--tiq-prose-body))">Mozambique (Tete)</text>
      <text x="237" y="96" textAnchor="middle" fontSize="8" fill="rgb(var(--tiq-prose-body))">Moatize mine</text>
      {/* Sulphur */}
      <rect x="325" y="30" width="140" height="75" rx="10" fill="rgb(var(--tiq-mint) / 0.1)" stroke="rgb(var(--tiq-mint) / 0.4)" strokeWidth="1.5" />
      <text x="395" y="52" textAnchor="middle" fontSize="11" fontWeight="700" fill="rgb(var(--tiq-ink))">Sulphur</text>
      <text x="395" y="68" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-mint))">🌱 Fertiliser</text>
      <text x="395" y="82" textAnchor="middle" fontSize="8" fill="rgb(var(--tiq-prose-body))">Byproduct of refining</text>
      <text x="395" y="96" textAnchor="middle" fontSize="8" fill="rgb(var(--tiq-prose-body))">& smelting</text>
      {/* Fungibility banner */}
      <rect x="15" y="135" width="450" height="35" rx="8" fill="rgb(var(--tiq-mintLight))" stroke="rgb(var(--tiq-border))" strokeWidth="1" />
      <text x="240" y="158" textAnchor="middle" fontSize="10" fontWeight="600" fill="rgb(var(--tiq-mint))">Fungible = interchangeable by grade & specification</text>
      {/* Byproduct arrows */}
      <text x="100" y="205" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">🛢️ Oil Refining</text>
      <text x="240" y="205" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">⛽ Gas Processing</text>
      <text x="380" y="205" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">⛏️ Metal Smelting</text>
      <line x1="100" y1="190" x2="350" y2="115" stroke="rgb(var(--tiq-gold) / 0.3)" strokeWidth="1" strokeDasharray="3 2" />
      <line x1="240" y1="190" x2="380" y2="115" stroke="rgb(var(--tiq-gold) / 0.3)" strokeWidth="1" strokeDasharray="3 2" />
      <line x1="380" y1="190" x2="410" y2="115" stroke="rgb(var(--tiq-gold) / 0.3)" strokeWidth="1" strokeDasharray="3 2" />
    </svg>
  ),

  market_types: () => (
    <svg viewBox="0 0 480 220" className="w-full max-w-lg mx-auto my-4">
      {/* Spot */}
      <rect x="15" y="20" width="140" height="80" rx="10" fill="rgb(var(--tiq-mint) / 0.1)" stroke="rgb(var(--tiq-mint) / 0.4)" strokeWidth="1.5" />
      <text x="85" y="42" textAnchor="middle" fontSize="11" fontWeight="700" fill="rgb(var(--tiq-mint))">Spot</text>
      <text x="85" y="60" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">Immediate delivery</text>
      <text x="85" y="75" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">Today's price</text>
      <text x="85" y="90" textAnchor="middle" fontSize="8" fill="rgb(var(--tiq-prose-body))" fontStyle="italic">No counterparty risk</text>
      {/* Forward */}
      <rect x="170" y="20" width="140" height="80" rx="10" fill="rgb(var(--tiq-gold) / 0.1)" stroke="rgb(var(--tiq-gold) / 0.4)" strokeWidth="1.5" />
      <text x="240" y="42" textAnchor="middle" fontSize="11" fontWeight="700" fill="rgb(var(--tiq-gold))">Forward (OTC)</text>
      <text x="240" y="60" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">Future date</text>
      <text x="240" y="75" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">Agreed price</text>
      <text x="240" y="90" textAnchor="middle" fontSize="8" fill="rgb(var(--tiq-prose-body))" fontStyle="italic">Customisable · counterparty risk</text>
      {/* Futures */}
      <rect x="325" y="20" width="140" height="80" rx="10" fill="rgb(var(--tiq-mint) / 0.12)" stroke="rgb(var(--tiq-mint) / 0.5)" strokeWidth="1.5" />
      <text x="395" y="42" textAnchor="middle" fontSize="11" fontWeight="700" fill="rgb(var(--tiq-mint))">Futures</text>
      <text x="395" y="60" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">Exchange-traded</text>
      <text x="395" y="75" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">Standardised</text>
      <text x="395" y="90" textAnchor="middle" fontSize="8" fill="rgb(var(--tiq-prose-body))" fontStyle="italic">Cleared · mark-to-market</text>
      {/* Benchmarks */}
      <rect x="15" y="125" width="450" height="75" rx="8" fill="rgb(var(--tiq-mintLight))" stroke="rgb(var(--tiq-border))" strokeWidth="1" />
      <text x="240" y="145" textAnchor="middle" fontSize="10" fontWeight="700" fill="rgb(var(--tiq-ink))">Price Benchmarks</text>
      <text x="90" y="165" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-mint))" fontWeight="600">API2</text>
      <text x="90" y="180" textAnchor="middle" fontSize="8" fill="rgb(var(--tiq-prose-body))">ARA (Europe)</text>
      <text x="240" y="165" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-mint))" fontWeight="600">API4</text>
      <text x="240" y="180" textAnchor="middle" fontSize="8" fill="rgb(var(--tiq-prose-body))">FOB Richards Bay</text>
      <text x="390" y="165" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-mint))" fontWeight="600">Argus/Platts</text>
      <text x="390" y="180" textAnchor="middle" fontSize="8" fill="rgb(var(--tiq-prose-body))">Sulphur assessments</text>
    </svg>
  ),

  lc_payment_flow: () => (
    <svg viewBox="0 0 520 280" className="w-full max-w-lg mx-auto my-4">
      {/* Buyer */}
      <rect x="15" y="120" width="100" height="50" rx="8" fill="rgb(var(--tiq-gold) / 0.1)" stroke="rgb(var(--tiq-gold) / 0.4)" strokeWidth="1.5" />
      <text x="65" y="142" textAnchor="middle" fontSize="11" fontWeight="700" fill="rgb(var(--tiq-ink))">Buyer</text>
      <text x="65" y="157" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">Opens LC</text>
      {/* Issuing Bank */}
      <rect x="180" y="20" width="120" height="50" rx="8" fill="rgb(var(--tiq-mint) / 0.1)" stroke="rgb(var(--tiq-mint) / 0.4)" strokeWidth="1.5" />
      <text x="240" y="42" textAnchor="middle" fontSize="11" fontWeight="700" fill="rgb(var(--tiq-ink))">Issuing Bank</text>
      <text x="240" y="57" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">Conditional undertaking</text>
      {/* Seller */}
      <rect x="400" y="120" width="100" height="50" rx="8" fill="rgb(var(--tiq-gold) / 0.1)" stroke="rgb(var(--tiq-gold) / 0.4)" strokeWidth="1.5" />
      <text x="450" y="142" textAnchor="middle" fontSize="11" fontWeight="700" fill="rgb(var(--tiq-ink))">Seller</text>
      <text x="450" y="157" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">Ships goods</text>
      {/* Confirming Bank */}
      <rect x="180" y="210" width="120" height="50" rx="8" fill="rgb(var(--tiq-mint) / 0.1)" stroke="rgb(var(--tiq-mint) / 0.4)" strokeWidth="1.5" />
      <text x="240" y="232" textAnchor="middle" fontSize="11" fontWeight="700" fill="rgb(var(--tiq-ink))">Confirming Bank</text>
      <text x="240" y="247" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">Pays seller</text>
      {/* Arrows */}
      <line x1="115" y1="135" x2="180" y2="60" stroke="rgb(var(--tiq-mint) / 0.5)" strokeWidth="1.5" markerEnd="url(#lcArrow)" />
      <text x="135" y="90" fontSize="8" fill="rgb(var(--tiq-mint))" fontWeight="600">1. LC application</text>
      <line x1="300" y1="50" x2="400" y2="130" stroke="rgb(var(--tiq-mint) / 0.5)" strokeWidth="1.5" markerEnd="url(#lcArrow)" />
      <text x="330" y="90" fontSize="8" fill="rgb(var(--tiq-mint))" fontWeight="600">2. LC advice</text>
      <line x1="450" y1="170" x2="300" y2="225" stroke="rgb(var(--tiq-mint) / 0.5)" strokeWidth="1.5" markerEnd="url(#lcArrow)" />
      <text x="335" y="215" fontSize="8" fill="rgb(var(--tiq-mint))" fontWeight="600">3. Present documents</text>
      <line x1="180" y1="225" x2="115" y2="160" stroke="rgb(var(--tiq-mint) / 0.5)" strokeWidth="1.5" markerEnd="url(#lcArrow)" />
      <text x="105" y="210" fontSize="8" fill="rgb(var(--tiq-mint))" fontWeight="600">4. Reimburse</text>
      <text x="240" y="275" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))" fontStyle="italic">Bank pays against conforming documents — not the goods</text>
      <defs>
        <marker id="lcArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="rgb(var(--tiq-mint) / 0.6)" />
        </marker>
      </defs>
    </svg>
  ),

  ifrs9_classification: () => (
    <svg viewBox="0 0 480 240" className="w-full max-w-lg mx-auto my-4">
      {/* Root */}
      <rect x="160" y="10" width="160" height="40" rx="8" fill="rgb(var(--tiq-mint) / 0.15)" stroke="rgb(var(--tiq-mint) / 0.5)" strokeWidth="1.5" />
      <text x="240" y="35" textAnchor="middle" fontSize="11" fontWeight="700" fill="rgb(var(--tiq-ink))">Financial Asset</text>
      {/* Lines to children */}
      <line x1="240" y1="50" x2="90" y2="80" stroke="rgb(var(--tiq-border))" strokeWidth="1.5" />
      <line x1="240" y1="50" x2="240" y2="80" stroke="rgb(var(--tiq-border))" strokeWidth="1.5" />
      <line x1="240" y1="50" x2="390" y2="80" stroke="rgb(var(--tiq-border))" strokeWidth="1.5" />
      {/* Amortised cost */}
      <rect x="20" y="80" width="140" height="60" rx="8" fill="rgb(var(--tiq-gold) / 0.1)" stroke="rgb(var(--tiq-gold) / 0.4)" strokeWidth="1.5" />
      <text x="90" y="100" textAnchor="middle" fontSize="10" fontWeight="700" fill="rgb(var(--tiq-ink))">Amortised Cost</text>
      <text x="90" y="116" textAnchor="middle" fontSize="8" fill="rgb(var(--tiq-prose-body))">Hold to collect</text>
      <text x="90" y="128" textAnchor="middle" fontSize="8" fill="rgb(var(--tiq-prose-body))">principal + interest</text>
      {/* FVOCI */}
      <rect x="170" y="80" width="140" height="60" rx="8" fill="rgb(var(--tiq-mint) / 0.1)" stroke="rgb(var(--tiq-mint) / 0.4)" strokeWidth="1.5" />
      <text x="240" y="100" textAnchor="middle" fontSize="10" fontWeight="700" fill="rgb(var(--tiq-ink))">FVOCI</text>
      <text x="240" y="116" textAnchor="middle" fontSize="8" fill="rgb(var(--tiq-prose-body))">Fair value through</text>
      <text x="240" y="128" textAnchor="middle" fontSize="8" fill="rgb(var(--tiq-prose-body))">other comprehensive income</text>
      {/* FVTPL */}
      <rect x="320" y="80" width="140" height="60" rx="8" fill="rgb(var(--tiq-mint) / 0.12)" stroke="rgb(var(--tiq-mint) / 0.5)" strokeWidth="1.5" />
      <text x="390" y="100" textAnchor="middle" fontSize="10" fontWeight="700" fill="rgb(var(--tiq-ink))">FVTPL</text>
      <text x="390" y="116" textAnchor="middle" fontSize="8" fill="rgb(var(--tiq-prose-body))">Fair value through</text>
      <text x="390" y="128" textAnchor="middle" fontSize="8" fill="rgb(var(--tiq-prose-body))">profit or loss</text>
      {/* Derivatives note */}
      <rect x="100" y="170" width="280" height="50" rx="8" fill="rgb(var(--tiq-mintLight))" stroke="rgb(var(--tiq-border))" strokeWidth="1" />
      <text x="240" y="190" textAnchor="middle" fontSize="9" fontWeight="600" fill="rgb(var(--tiq-mint))">Commodity Derivatives (API4 futures, swaps)</text>
      <text x="240" y="206" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">→ FVTPL unless hedge accounting applies</text>
    </svg>
  ),

  ias2_nrv: () => (
    <svg viewBox="0 0 480 220" className="w-full max-w-lg mx-auto my-4">
      {/* Cost bar */}
      <text x="80" y="30" textAnchor="middle" fontSize="10" fontWeight="700" fill="rgb(var(--tiq-ink))">Cost</text>
      <rect x="40" y="40" width="120" height="30" rx="4" fill="rgb(var(--tiq-gold) / 0.15)" stroke="rgb(var(--tiq-gold) / 0.4)" strokeWidth="1.5" />
      <text x="100" y="60" textAnchor="middle" fontSize="10" fill="rgb(var(--tiq-prose-body))">$180/MT</text>
      {/* NRV bar */}
      <text x="320" y="30" textAnchor="middle" fontSize="10" fontWeight="700" fill="rgb(var(--tiq-ink))">NRV</text>
      <rect x="260" y="40" width="90" height="30" rx="4" fill="rgb(var(--tiq-mint) / 0.15)" stroke="rgb(var(--tiq-mint) / 0.4)" strokeWidth="1.5" />
      <text x="305" y="60" textAnchor="middle" fontSize="10" fill="rgb(var(--tiq-prose-body))">$147/MT</text>
      {/* Write-down arrow */}
      <line x1="160" y1="55" x2="260" y2="55" stroke="rgb(var(--tiq-mint) / 0.5)" strokeWidth="2" markerEnd="url(#nrvArrow)" />
      <text x="210" y="48" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-mint))" fontWeight="600">write-down $33</text>
      {/* Formula */}
      <rect x="40" y="100" width="400" height="40" rx="8" fill="rgb(var(--tiq-mintLight))" stroke="rgb(var(--tiq-border))" strokeWidth="1" />
      <text x="240" y="118" textAnchor="middle" fontSize="10" fontWeight="600" fill="rgb(var(--tiq-ink))">Carry at: lower of Cost and NRV</text>
      <text x="240" y="133" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">NRV = selling price − costs to complete − costs to sell</text>
      {/* Result */}
      <rect x="120" y="165" width="240" height="40" rx="8" fill="rgb(var(--tiq-mint) / 0.12)" stroke="rgb(var(--tiq-mint) / 0.5)" strokeWidth="1.5" />
      <text x="240" y="183" textAnchor="middle" fontSize="10" fontWeight="700" fill="rgb(var(--tiq-mint))">Carrying Value = $147/MT</text>
      <text x="240" y="198" textAnchor="middle" fontSize="8" fill="rgb(var(--tiq-prose-body))">(NRV &lt; Cost → write down to NRV)</text>
      <defs>
        <marker id="nrvArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="rgb(var(--tiq-mint) / 0.6)" />
        </marker>
      </defs>
    </svg>
  ),

  revenue_recognition_timeline: () => (
    <svg viewBox="0 0 520 180" className="w-full max-w-lg mx-auto my-4">
      {/* Timeline */}
      <line x1="40" y1="80" x2="480" y2="80" stroke="rgb(var(--tiq-border))" strokeWidth="3" />
      {/* Contract signed */}
      <circle cx="80" cy="80" r="6" fill="rgb(var(--tiq-gold))" />
      <text x="80" y="60" textAnchor="middle" fontSize="10" fontWeight="700" fill="rgb(var(--tiq-ink))">Contract</text>
      <text x="80" y="105" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">Signed</text>
      {/* Shipment / B/L date */}
      <circle cx="240" cy="80" r="8" fill="rgb(var(--tiq-mint))" />
      <text x="240" y="55" textAnchor="middle" fontSize="10" fontWeight="700" fill="rgb(var(--tiq-mint))">★ Revenue Recognised</text>
      <text x="240" y="105" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">B/L date: 15 March</text>
      <text x="240" y="120" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-mint))" fontWeight="600">$7.2m recognised</text>
      {/* Payment */}
      <circle cx="420" cy="80" r="6" fill="rgb(var(--tiq-gold))" />
      <text x="420" y="60" textAnchor="middle" fontSize="10" fontWeight="700" fill="rgb(var(--tiq-ink))">Payment</text>
      <text x="420" y="105" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">LC drawn</text>
      {/* FOB label */}
      <rect x="180" y="135" width="120" height="30" rx="6" fill="rgb(var(--tiq-mint) / 0.15)" stroke="rgb(var(--tiq-mint) / 0.5)" strokeWidth="1.5" />
      <text x="240" y="155" textAnchor="middle" fontSize="9" fontWeight="700" fill="rgb(var(--tiq-mint))">FOB → control on loading</text>
    </svg>
  ),

  onerous_contract: () => (
    <svg viewBox="0 0 480 240" className="w-full max-w-lg mx-auto my-4">
      {/* Fulfil cost */}
      <rect x="30" y="30" width="180" height="100" rx="10" fill="rgb(var(--tiq-gold) / 0.1)" stroke="rgb(var(--tiq-gold) / 0.4)" strokeWidth="1.5" />
      <text x="120" y="52" textAnchor="middle" fontSize="11" fontWeight="700" fill="rgb(var(--tiq-ink))">Cost to Fulfil</text>
      <text x="120" y="72" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">100,000 × ($130 − $105)</text>
      <text x="120" y="92" textAnchor="middle" fontSize="14" fontWeight="700" fill="rgb(var(--tiq-gold))">$2,500,000</text>
      <text x="120" y="115" textAnchor="middle" fontSize="8" fill="rgb(var(--tiq-prose-body))" fontStyle="italic">Buy at above-market price</text>
      {/* Exit penalty */}
      <rect x="270" y="30" width="180" height="100" rx="10" fill="rgb(var(--tiq-mint) / 0.1)" stroke="rgb(var(--tiq-mint) / 0.4)" strokeWidth="1.5" />
      <text x="360" y="52" textAnchor="middle" fontSize="11" fontWeight="700" fill="rgb(var(--tiq-ink))">Exit Penalty</text>
      <text x="360" y="72" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">Cancellation fee</text>
      <text x="360" y="92" textAnchor="middle" fontSize="14" fontWeight="700" fill="rgb(var(--tiq-mint))">$500,000</text>
      <text x="360" y="115" textAnchor="middle" fontSize="8" fill="rgb(var(--tiq-prose-body))" fontStyle="italic">Pay to walk away</text>
      {/* Lower of */}
      <text x="240" y="85" textAnchor="middle" fontSize="20" fill="rgb(var(--tiq-prose-body))">vs</text>
      {/* Result */}
      <rect x="100" y="160" width="280" height="60" rx="10" fill="rgb(var(--tiq-mint) / 0.12)" stroke="rgb(var(--tiq-mint) / 0.5)" strokeWidth="1.5" />
      <text x="240" y="180" textAnchor="middle" fontSize="10" fontWeight="600" fill="rgb(var(--tiq-ink))">Provision = lower of the two</text>
      <text x="240" y="200" textAnchor="middle" fontSize="16" fontWeight="700" fill="rgb(var(--tiq-mint))">$500,000</text>
    </svg>
  ),

  screen_scraping_vs_api: () => (
    <svg viewBox="0 0 520 240" className="w-full max-w-lg mx-auto my-4">
      {/* OLD: Screen scraping */}
      <text x="130" y="20" textAnchor="middle" fontSize="11" fontWeight="700" fill="rgb(var(--tiq-gold))">Before: Screen Scraping</text>
      <rect x="30" y="30" width="80" height="40" rx="8" fill="rgb(var(--tiq-gold) / 0.1)" stroke="rgb(var(--tiq-gold) / 0.4)" strokeWidth="1.5" />
      <text x="70" y="55" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-ink))">TPP App</text>
      <line x1="110" y1="50" x2="170" y2="50" stroke="rgb(var(--tiq-gold) / 0.5)" strokeWidth="2" markerEnd="url(#ssArrow)" />
      <text x="140" y="42" textAnchor="middle" fontSize="8" fill="rgb(var(--tiq-gold))" fontWeight="600">credentials!</text>
      <rect x="170" y="30" width="80" height="40" rx="8" fill="rgb(var(--tiq-gold) / 0.1)" stroke="rgb(var(--tiq-gold) / 0.4)" strokeWidth="1.5" />
      <text x="210" y="55" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-ink))">Bank</text>
      <text x="130" y="90" textAnchor="middle" fontSize="8" fill="rgb(var(--tiq-gold))" fontStyle="italic">⚠️ Customer shares password</text>
      <text x="130" y="103" textAnchor="middle" fontSize="8" fill="rgb(var(--tiq-gold))" fontStyle="italic">⚠️ Security risk</text>
      {/* Divider */}
      <line x1="265" y1="10" x2="265" y2="120" stroke="rgb(var(--tiq-border))" strokeWidth="1.5" strokeDasharray="4 4" />
      {/* NEW: API model */}
      <text x="390" y="20" textAnchor="middle" fontSize="11" fontWeight="700" fill="rgb(var(--tiq-mint))">After: Open Finance API</text>
      <rect x="290" y="30" width="80" height="40" rx="8" fill="rgb(var(--tiq-mint) / 0.1)" stroke="rgb(var(--tiq-mint) / 0.4)" strokeWidth="1.5" />
      <text x="330" y="55" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-ink))">TPP App</text>
      <line x1="370" y1="50" x2="430" y2="50" stroke="rgb(var(--tiq-mint) / 0.5)" strokeWidth="2" markerEnd="url(#ssArrow)" />
      <text x="400" y="42" textAnchor="middle" fontSize="8" fill="rgb(var(--tiq-mint))" fontWeight="600">API + token</text>
      <rect x="430" y="30" width="80" height="40" rx="8" fill="rgb(var(--tiq-mint) / 0.1)" stroke="rgb(var(--tiq-mint) / 0.4)" strokeWidth="1.5" />
      <text x="470" y="55" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-ink))">Bank</text>
      <text x="390" y="90" textAnchor="middle" fontSize="8" fill="rgb(var(--tiq-mint))" fontStyle="italic">✓ Customer authenticates at bank</text>
      <text x="390" y="103" textAnchor="middle" fontSize="8" fill="rgb(var(--tiq-mint))" fontStyle="italic">✓ Scoped · time-limited · revocable</text>
      {/* Bottom: consent */}
      <rect x="30" y="140" width="460" height="80" rx="10" fill="rgb(var(--tiq-mintLight))" stroke="rgb(var(--tiq-border))" strokeWidth="1" />
      <text x="260" y="162" textAnchor="middle" fontSize="10" fontWeight="700" fill="rgb(var(--tiq-mint))">The Key Shift</text>
      <text x="260" y="180" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">Customer grants consent through the bank's own authentication</text>
      <text x="260" y="196" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">TPP receives only authorised data — never the credentials</text>
      <text x="260" y="212" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-mint))" fontWeight="600">Three pillars: Data sharing · Payment initiation · Product info</text>
      <defs>
        <marker id="ssArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="rgb(var(--tiq-mint) / 0.6)" />
        </marker>
      </defs>
    </svg>
  ),

  rest_api_flow: () => (
    <svg viewBox="0 0 520 200" className="w-full max-w-lg mx-auto my-4">
      {/* TPP */}
      <rect x="20" y="60" width="100" height="60" rx="10" fill="rgb(var(--tiq-mint) / 0.1)" stroke="rgb(var(--tiq-mint) / 0.4)" strokeWidth="1.5" />
      <text x="70" y="85" textAnchor="middle" fontSize="11" fontWeight="700" fill="rgb(var(--tiq-ink))">TPP</text>
      <text x="70" y="100" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">Client app</text>
      {/* Hub */}
      <rect x="210" y="60" width="100" height="60" rx="10" fill="rgb(var(--tiq-gold) / 0.1)" stroke="rgb(var(--tiq-gold) / 0.4)" strokeWidth="1.5" />
      <text x="260" y="85" textAnchor="middle" fontSize="11" fontWeight="700" fill="rgb(var(--tiq-ink))">API Hub</text>
      <text x="260" y="100" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">Consent check</text>
      {/* Bank */}
      <rect x="400" y="60" width="100" height="60" rx="10" fill="rgb(var(--tiq-mint) / 0.1)" stroke="rgb(var(--tiq-mint) / 0.4)" strokeWidth="1.5" />
      <text x="450" y="85" textAnchor="middle" fontSize="11" fontWeight="700" fill="rgb(var(--tiq-ink))">Bank (LFI)</text>
      <text x="450" y="100" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">Returns data</text>
      {/* Request */}
      <line x1="120" y1="75" x2="210" y2="75" stroke="rgb(var(--tiq-mint) / 0.5)" strokeWidth="2" markerEnd="url(#apiArrow)" />
      <text x="165" y="68" textAnchor="middle" fontSize="8" fill="rgb(var(--tiq-mint))" fontWeight="600">GET /accounts</text>
      <line x1="310" y1="75" x2="400" y2="75" stroke="rgb(var(--tiq-mint) / 0.5)" strokeWidth="2" markerEnd="url(#apiArrow)" />
      <text x="355" y="68" textAnchor="middle" fontSize="8" fill="rgb(var(--tiq-mint))" fontWeight="600">+ access token</text>
      {/* Response */}
      <line x1="400" y1="105" x2="310" y2="105" stroke="rgb(var(--tiq-gold) / 0.5)" strokeWidth="2" markerEnd="url(#apiArrow2)" />
      <text x="355" y="120" textAnchor="middle" fontSize="8" fill="rgb(var(--tiq-gold))" fontWeight="600">JSON response</text>
      <line x1="210" y1="105" x2="120" y2="105" stroke="rgb(var(--tiq-gold) / 0.5)" strokeWidth="2" markerEnd="url(#apiArrow2)" />
      <text x="165" y="120" textAnchor="middle" fontSize="8" fill="rgb(var(--tiq-gold))" fontWeight="600">+ logging</text>
      {/* Bottom note */}
      <text x="260" y="160" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))" fontStyle="italic">RESTful · JSON · stateless · versioned (e.g. /v1/accounts)</text>
      <text x="260" y="178" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-mint))" fontWeight="600">Authentication → Consent check → Request → Response → Audit log</text>
      <defs>
        <marker id="apiArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="rgb(var(--tiq-mint) / 0.6)" />
        </marker>
        <marker id="apiArrow2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="rgb(var(--tiq-gold) / 0.5)" />
        </marker>
      </defs>
    </svg>
  ),

  aani_proxy_payment: () => (
    <svg viewBox="0 0 480 200" className="w-full max-w-lg mx-auto my-4">
      {/* Sender */}
      <rect x="20" y="70" width="90" height="50" rx="10" fill="rgb(var(--tiq-mint) / 0.1)" stroke="rgb(var(--tiq-mint) / 0.4)" strokeWidth="1.5" />
      <text x="65" y="92" textAnchor="middle" fontSize="11" fontWeight="700" fill="rgb(var(--tiq-ink))">Sender</text>
      <text x="65" y="107" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">📱 phone number</text>
      {/* Aani */}
      <circle cx="240" cy="95" r="35" fill="rgb(var(--tiq-mint) / 0.15)" stroke="rgb(var(--tiq-mint) / 0.5)" strokeWidth="2" />
      <text x="240" y="92" textAnchor="middle" fontSize="11" fontWeight="700" fill="rgb(var(--tiq-mint))">Aani</text>
      <text x="240" y="106" textAnchor="middle" fontSize="8" fill="rgb(var(--tiq-prose-body))">instant · 24/7</text>
      {/* Recipient */}
      <rect x="370" y="70" width="90" height="50" rx="10" fill="rgb(var(--tiq-gold) / 0.1)" stroke="rgb(var(--tiq-gold) / 0.4)" strokeWidth="1.5" />
      <text x="415" y="92" textAnchor="middle" fontSize="11" fontWeight="700" fill="rgb(var(--tiq-ink))">Recipient</text>
      <text x="415" y="107" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">📱 gets funds</text>
      {/* Arrows */}
      <line x1="110" y1="90" x2="205" y2="90" stroke="rgb(var(--tiq-mint) / 0.5)" strokeWidth="2" markerEnd="url(#aaniArrow)" />
      <text x="157" y="82" textAnchor="middle" fontSize="8" fill="rgb(var(--tiq-mint))" fontWeight="600">sends to</text>
      <line x1="275" y1="90" x2="370" y2="90" stroke="rgb(var(--tiq-mint) / 0.5)" strokeWidth="2" markerEnd="url(#aaniArrow)" />
      <text x="322" y="82" textAnchor="middle" fontSize="8" fill="rgb(var(--tiq-mint))" fontWeight="600">resolves to IBAN</text>
      {/* Benefits */}
      <rect x="30" y="145" width="420" height="40" rx="8" fill="rgb(var(--tiq-mintLight))" stroke="rgb(var(--tiq-border))" strokeWidth="1" />
      <text x="240" y="162" textAnchor="middle" fontSize="9" fontWeight="600" fill="rgb(var(--tiq-mint))">✓ Privacy (IBAN hidden)  ✓ No typos  ✓ Up to AED 50,000</text>
      <text x="240" y="177" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">Proxy = mobile number or email replaces the IBAN</text>
      <defs>
        <marker id="aaniArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="rgb(var(--tiq-mint) / 0.6)" />
        </marker>
      </defs>
    </svg>
  ),

  provisional_pricing_timeline: () => (
    <svg viewBox="0 0 520 180" className="w-full max-w-lg mx-auto my-4">
      {/* Timeline */}
      <line x1="40" y1="80" x2="480" y2="80" stroke="rgb(var(--tiq-border))" strokeWidth="3" />
      {/* Shipment point */}
      <circle cx="80" cy="80" r="8" fill="rgb(var(--tiq-mint))" />
      <text x="80" y="60" textAnchor="middle" fontSize="10" fontWeight="700" fill="rgb(var(--tiq-ink))">Shipment</text>
      <text x="80" y="110" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">March · B/L date</text>
      <text x="80" y="125" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-mint))" fontWeight="600">Provisional $90</text>
      {/* QP period */}
      <rect x="200" y="65" width="140" height="30" rx="6" fill="rgb(var(--tiq-gold) / 0.12)" stroke="rgb(var(--tiq-gold) / 0.4)" strokeWidth="1.5" />
      <text x="270" y="85" textAnchor="middle" fontSize="10" fontWeight="700" fill="rgb(var(--tiq-gold))">QP = April (M+1)</text>
      <text x="270" y="55" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">Average API4 over this period</text>
      {/* Final price point */}
      <circle cx="440" cy="80" r="8" fill="rgb(var(--tiq-mint))" />
      <text x="440" y="60" textAnchor="middle" fontSize="10" fontWeight="700" fill="rgb(var(--tiq-ink))">Settlement</text>
      <text x="440" y="110" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-prose-body))">April ends</text>
      <text x="440" y="125" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-mint))" fontWeight="600">Final $96</text>
      {/* Arrow showing remeasurement */}
      <path d="M90 140 Q 270 165 430 140" fill="none" stroke="rgb(var(--tiq-mint) / 0.4)" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#arrow7)" />
      <text x="270" y="160" textAnchor="middle" fontSize="9" fill="rgb(var(--tiq-mint))" fontWeight="600">Remeasure: +$6/MT → +$300k revenue</text>
      <defs>
        <marker id="arrow7" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="rgb(var(--tiq-mint) / 0.5)" />
        </marker>
      </defs>
    </svg>
  ),
};

import DataDiagram from "@/components/tradeiq/DataDiagram";

export default function LessonDiagram({ type, spec }) {
  const Diagram = DIAGRAMS[type];
  if (!Diagram && !spec) return null;
  return (
    <div className="my-6 rounded-xl border border-tiq-border bg-white/50 p-4 overflow-x-auto">
      {Diagram ? <Diagram /> : <DataDiagram spec={spec} />}
    </div>
  );
}