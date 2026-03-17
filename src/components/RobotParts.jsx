import React from 'react'

export const RobotHeads = {
  standard: ({ color }) => (
    <g>
      <rect x="35" y="15" width="30" height="25" rx="4" fill={color} stroke="currentColor" strokeWidth="2" />
      <circle cx="43" cy="25" r="3" fill="#fff" />
      <circle cx="57" cy="25" r="3" fill="#fff" />
      <path d="M45 33 h10" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <path d="M50 15 L50 5" stroke="currentColor" strokeWidth="2" />
      <circle cx="50" cy="5" r="2" fill="#ef4444" />
    </g>
  ),
  radar: ({ color }) => (
    <g>
      <path d="M35 25 a15 15 0 0 1 30 0 v15 h-30 z" fill={color} stroke="currentColor" strokeWidth="2" />
      <rect x="40" y="25" width="20" height="8" rx="2" fill="#38bdf8" />
      <path d="M50 10 L50 5 M45 8 L42 4 M55 8 L58 4" stroke="currentColor" strokeWidth="2" />
    </g>
  ),
  smart: ({ color }) => (
    <g>
      <rect x="30" y="10" width="40" height="30" rx="8" fill={color} stroke="currentColor" strokeWidth="2" />
      <rect x="35" y="15" width="30" height="20" rx="4" fill="#1e293b" />
      <circle cx="42" cy="25" r="2" fill="#22c55e" className="animate-pulse" />
      <circle cx="58" cy="25" r="2" fill="#22c55e" className="animate-pulse" />
    </g>
  )
}

export const RobotBodies = {
  box: ({ color }) => (
    <g>
      <rect x="25" y="42" width="50" height="40" rx="4" fill={color} stroke="currentColor" strokeWidth="2" />
      <rect x="35" y="50" width="30" height="24" rx="2" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" />
    </g>
  ),
  round: ({ color }) => (
    <g>
      <circle cx="50" cy="62" r="22" fill={color} stroke="currentColor" strokeWidth="2" />
      <circle cx="50" cy="62" r="10" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
    </g>
  ),
  triangle: ({ color }) => (
    <g>
      <path d="M25 42 h50 l-10 40 h-30 z" fill={color} stroke="currentColor" strokeWidth="2" />
      <path d="M35 55 h30 M38 65 h24" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
    </g>
  )
}

export const RobotArms = {
  basic: ({ color }) => (
    <g>
      <path d="M25 50 L10 60" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
      <circle cx="10" cy="60" r="3" fill="#94a3b8" />
      <path d="M75 50 L90 60" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
      <circle cx="90" cy="60" r="3" fill="#94a3b8" />
    </g>
  ),
  magnet: ({ color }) => (
    <g>
      <path d="M25 50 L12 65" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
      <path d="M8 65 a4 4 0 0 1 8 0" stroke="#ef4444" strokeWidth="3" fill="none" />
      <path d="M75 50 L88 65" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
      <path d="M84 65 a4 4 0 0 1 8 0" stroke="#ef4444" strokeWidth="3" fill="none" />
    </g>
  ),
  clamp: ({ color }) => (
    <g>
      <path d="M25 50 L10 50 L10 65" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
      <path d="M5 65 h10" stroke="#94a3b8" strokeWidth="2" />
      <path d="M75 50 L90 50 L90 65" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
      <path d="M85 65 h10" stroke="#94a3b8" strokeWidth="2" />
    </g>
  )
}

export const RobotBases = {
  legs: ({ color }) => (
    <g>
      <path d="M35 82 L35 95 h-5" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
      <path d="M65 82 L65 95 h5" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
    </g>
  ),
  wheels: ({ color }) => (
    <g>
      <circle cx="35" cy="90" r="8" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />
      <circle cx="35" cy="90" r="3" fill="#64748b" />
      <circle cx="65" cy="90" r="8" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />
      <circle cx="65" cy="90" r="3" fill="#64748b" />
      <rect x="25" y="82" width="50" height="4" fill="#94a3b8" />
    </g>
  ),
  hover: ({ color }) => (
    <g>
      <ellipse cx="50" cy="90" rx="25" ry="5" fill="#38bdf8" fillOpacity="0.5" className="animate-pulse" />
      <path d="M40 82 L50 90 L60 82" stroke="#38bdf8" strokeWidth="2" fill="none" />
    </g>
  )
}
