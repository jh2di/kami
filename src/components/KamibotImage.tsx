import React from 'react';

interface KamibotImageProps {
  className?: string;
  glow?: boolean;
}

/**
 * High-fidelity vector illustration of Kamibot (카미봇).
 * Faithfully matches the real Kamibot:
 * - Clean white cylindrical body with smooth rounded top
 * - Glowing neon cyan circular LED light ring on the top lid
 * - Glowing horizontal cyan LED accent strip
 * - Arched cyan LED visor/brow contour
 * - Two circular camera/ultrasonic sensor eyes with metallic silver bezels and dark center lenses
 */
export const KamibotImage: React.FC<KamibotImageProps> = ({ className = 'w-24 h-24', glow = true }) => {
  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      {glow && (
        <div className="absolute inset-0 rounded-full bg-cyan-400/25 blur-xl pointer-events-none animate-pulse" />
      )}
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)] relative z-10"
      >
        <defs>
          {/* Body White Gradient */}
          <linearGradient id="kamiBodyGrad" x1="20" y1="50" x2="180" y2="170" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>

          {/* Top Lid Gradient */}
          <linearGradient id="kamiLidGrad" x1="100" y1="15" x2="100" y2="55" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>

          {/* Cyan Glow Gradient */}
          <linearGradient id="kamiCyanGlow" x1="30" y1="30" x2="170" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00f2fe" />
            <stop offset="50%" stopColor="#4facfe" />
            <stop offset="100%" stopColor="#00f2fe" />
          </linearGradient>

          {/* Eye Silver Bezel Gradient */}
          <linearGradient id="kamiEyeBezel" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>

          {/* Eye Lens Gradient */}
          <radialGradient id="kamiEyeLens" cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="70%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>

          {/* Filter for glowing neon LEDs */}
          <filter id="cyanNeon" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Shadow base underneath */}
        <ellipse cx="100" cy="184" rx="72" ry="12" fill="#000000" fillOpacity="0.25" />

        {/* Lower wheels on sides */}
        <rect x="18" y="146" width="16" height="30" rx="6" fill="#334155" />
        <rect x="166" y="146" width="16" height="30" rx="6" fill="#334155" />

        {/* Main Cylindrical Body */}
        <path
          d="M 28 66 
             C 28 42, 50 30, 100 30 
             C 150 30, 172 42, 172 66 
             L 172 152 
             C 172 170, 150 176, 100 176 
             C 50 176, 28 170, 28 152 
             Z"
          fill="url(#kamiBodyGrad)"
          stroke="#94a3b8"
          strokeWidth="1.2"
        />

        {/* Top Dome Rim Bevel */}
        <ellipse cx="100" cy="46" rx="66" ry="24" fill="url(#kamiLidGrad)" stroke="#cbd5e1" strokeWidth="1.5" />

        {/* Top Recessed Plate */}
        <ellipse cx="100" cy="44" rx="54" ry="18" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />

        {/* Top Glowing Cyan LED Ring */}
        <ellipse
          cx="100"
          cy="44"
          rx="50"
          ry="15"
          fill="none"
          stroke="#00e5ff"
          strokeWidth="4"
          filter="url(#cyanNeon)"
        />
        <ellipse
          cx="100"
          cy="44"
          rx="50"
          ry="15"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeOpacity="0.8"
        />

        {/* Upper Horizontal Cyan LED Line across body */}
        <path
          d="M 30 76 C 60 84, 140 84, 170 76"
          fill="none"
          stroke="#00e5ff"
          strokeWidth="3.5"
          strokeLinecap="round"
          filter="url(#cyanNeon)"
        />
        <path
          d="M 30 76 C 60 84, 140 84, 170 76"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeOpacity="0.7"
        />

        {/* Center notch / sensor dot on upper band */}
        <rect x="97" y="77.5" width="6" height="3" rx="1.5" fill="#334155" />

        {/* Arched Wave Cyan Brow Line over eyes */}
        <path
          d="M 50 150 
             C 50 128, 62 120, 80 120 
             C 92 120, 97 125, 100 126 
             C 103 125, 108 120, 120 120 
             C 138 120, 150 128, 150 150"
          fill="none"
          stroke="#00e5ff"
          strokeWidth="3.5"
          strokeLinecap="round"
          filter="url(#cyanNeon)"
        />
        <path
          d="M 50 150 
             C 50 128, 62 120, 80 120 
             C 92 120, 97 125, 100 126 
             C 103 125, 108 120, 120 120 
             C 138 120, 150 128, 150 150"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeOpacity="0.8"
        />

        {/* Center notch on eyebrow wave */}
        <rect x="97.5" y="124" width="5" height="3" rx="1" fill="#334155" />

        {/* Left Eye - Round Ultrasonic / Camera Sensor */}
        <g>
          {/* Outer Chrome Bezel */}
          <circle cx="80" cy="144" r="16" fill="url(#kamiEyeBezel)" stroke="#64748b" strokeWidth="1" />
          {/* Inner Dark Lens */}
          <circle cx="80" cy="144" r="12" fill="url(#kamiEyeLens)" />
          {/* Lens Specular Reflection Highlight */}
          <circle cx="77" cy="141" r="3.5" fill="#ffffff" fillOpacity="0.85" />
          <circle cx="83" cy="147" r="1.5" fill="#38bdf8" fillOpacity="0.7" />
        </g>

        {/* Right Eye - Round Ultrasonic / Camera Sensor */}
        <g>
          {/* Outer Chrome Bezel */}
          <circle cx="120" cy="144" r="16" fill="url(#kamiEyeBezel)" stroke="#64748b" strokeWidth="1" />
          {/* Inner Dark Lens */}
          <circle cx="120" cy="144" r="12" fill="url(#kamiEyeLens)" />
          {/* Lens Specular Reflection Highlight */}
          <circle cx="117" cy="141" r="3.5" fill="#ffffff" fillOpacity="0.85" />
          <circle cx="123" cy="147" r="1.5" fill="#38bdf8" fillOpacity="0.7" />
        </g>

        {/* Delicate front lower body panel seams */}
        <path
          d="M 48 152 L 48 170"
          stroke="#cbd5e1"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M 152 152 L 152 170"
          stroke="#cbd5e1"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
