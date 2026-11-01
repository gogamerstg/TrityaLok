import React from 'react';

interface TrityaLokLogoProps {
  size?: number;
  className?: string;
  animated?: boolean;
  showText?: boolean;
}

export const TrityaLokLogo: React.FC<TrityaLokLogoProps> = ({
  size = 40,
  className = '',
  animated = true,
  showText = false,
}) => {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* 3D Sacred Spatial Emblem */}
      <div
        className="relative flex items-center justify-center flex-shrink-0"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 120 120"
          width={size}
          height={size}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={animated ? 'drop-shadow-[0_0_16px_rgba(0,242,254,0.45)]' : ''}
        >
          <defs>
            {/* Primary Glowing Gradients */}
            <linearGradient id="md_cyan_glow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00F2FE" />
              <stop offset="60%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#0369A1" />
            </linearGradient>

            <linearGradient id="md_violet_flame" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="50%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>

            <linearGradient id="md_emerald_waypoint" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>

            <linearGradient id="md_gold_beacon" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>

            {/* Facet Shader Gradients */}
            <linearGradient id="facet_top" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00F2FE" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#0F172A" stopOpacity="0.8" />
            </linearGradient>

            <linearGradient id="facet_left" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0369A1" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#070A0F" stopOpacity="0.95" />
            </linearGradient>

            <linearGradient id="facet_right" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#070A0F" stopOpacity="0.95" />
            </linearGradient>

            {/* Spatial Glow Filters */}
            <filter id="neon_glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="star_bloom" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="5" result="bloom" />
              <feComposite in="SourceGraphic" in2="bloom" operator="over" />
            </filter>
          </defs>

          {/* BACKGROUND AMBIENT RAYS */}
          <circle cx="60" cy="60" r="54" stroke="url(#md_cyan_glow)" strokeWidth="0.8" strokeDasharray="3 4" opacity="0.4" />
          <circle cx="60" cy="60" r="46" stroke="#1E293B" strokeWidth="1" opacity="0.6" />

          {/* ISOMETRIC TESSERACT / DIGITAL TWIN PRISM */}
          {/* Top Facet */}
          <polygon
            points="60,18 94,37 60,56 26,37"
            fill="url(#facet_top)"
            stroke="url(#md_cyan_glow)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Left Facet */}
          <polygon
            points="26,37 60,56 60,98 26,79"
            fill="url(#facet_left)"
            stroke="url(#md_cyan_glow)"
            strokeWidth="1.5"
            strokeLinejoin="round"
            opacity="0.95"
          />

          {/* Right Facet */}
          <polygon
            points="60,56 94,37 94,79 60,98"
            fill="url(#facet_right)"
            stroke="url(#md_violet_flame)"
            strokeWidth="1.5"
            strokeLinejoin="round"
            opacity="0.95"
          />

          {/* INNER SACRED PATH: INTERWOVEN 'M' & 'D' RIBBON */}
          {/* Lower Floor Trajectory (Level 1 Ascent) */}
          <path
            d="M 36,73 L 48,50 L 60,66 L 72,50 L 84,73"
            stroke="url(#md_cyan_glow)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#neon_glow)"
          />

          {/* Upper Dimension Loop (Level 2 Folding 'D' Arc) */}
          <path
            d="M 60,66 C 76,58 90,44 78,30 C 68,18 52,24 60,38"
            stroke="url(#md_violet_flame)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#neon_glow)"
          />

          {/* 3D Dynamic Connection Spline */}
          <path
            d="M 48,50 Q 60,34 72,50"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* CENTRAL GUIDING BEACON (MARG DARSHAK PULSAR) */}
          <g filter="url(#star_bloom)">
            {/* 4-Pointed Compass Star */}
            <path
              d="M 60,44 L 63.5,56.5 L 76,60 L 63.5,63.5 L 60,76 L 56.5,63.5 L 44,60 L 56.5,56.5 Z"
              fill="url(#md_gold_beacon)"
            />
            {/* Pulsing Core */}
            <circle cx="60" cy="60" r="3.2" fill="#FFFFFF" />
          </g>

          {/* LIDAR / 3D GAUSSIAN SPLAT ORBITAL NODES */}
          <circle cx="26" cy="37" r="2.8" fill="#00F2FE" filter="url(#neon_glow)" />
          <circle cx="94" cy="37" r="2.8" fill="#A855F7" filter="url(#neon_glow)" />
          <circle cx="60" cy="98" r="2.8" fill="#34D399" filter="url(#neon_glow)" />
          <circle cx="60" cy="18" r="2.8" fill="#FDE047" filter="url(#neon_glow)" />

          {/* Active Navigation Waypoint Satellite */}
          <circle cx="72" cy="50" r="2.2" fill="#FFFFFF" />
          <circle cx="48" cy="50" r="2.2" fill="#00F2FE" />
        </svg>
      </div>

      {/* Optional Typographical Wordmark */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="font-extrabold tracking-wider text-base bg-gradient-to-r from-cyan-400 via-teal-300 to-violet-400 bg-clip-text text-transparent font-sans">
              TRITYALOK
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold ml-0.5">
              3D
            </span>
          </div>
          <p className="text-[9px] font-mono text-slate-400 tracking-wider uppercase mt-0.5">
            Spatial Intelligence • IIT Bombay
          </p>
        </div>
      )}
    </div>
  );
};
