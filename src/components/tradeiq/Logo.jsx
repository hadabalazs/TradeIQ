import React from "react";

export default function Logo({ size = 36, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="40" height="40" rx="10" fill="url(#tiqLogoGrad)" />

      {/* Candlestick 1 — shortest */}
      <path d="M13 13V23" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />
      <rect x="11" y="15" width="4" height="6" rx="1" fill="white" opacity="0.55" />

      {/* Candlestick 2 — medium */}
      <path d="M20 11V25" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <rect x="18" y="13" width="4" height="8" rx="1" fill="white" opacity="0.8" />

      {/* Candlestick 3 — tallest */}
      <path d="M27 9V27" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="25" y="11" width="4" height="10" rx="1" fill="white" />

      {/* Mint leaf on top */}
      <path
        d="M27 9C30.5 5.5 34 6 34 6C34 6 33.5 10 30 12.5C27.5 14.2 25.5 11.5 27 9Z"
        fill="#E8F6EF"
      />
      <path
        d="M27 9C29 7 32 7 32 7"
        stroke="#5BA88E"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.5"
      />

      <defs>
        <linearGradient
          id="tiqLogoGrad"
          x1="0"
          y1="0"
          x2="40"
          y2="40"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#A8D5BA" />
          <stop offset="1" stopColor="#7CCBA8" />
        </linearGradient>
      </defs>
    </svg>
  );
}