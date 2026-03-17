import React from 'react'

const RobotAvatar = ({ emotion = 'idle', className = "w-full h-full" }) => {
  const eyeColor = "#38bdf8" // cyan-400
  
  return (
    <svg viewBox="0 0 100 100" className={`${className} drop-shadow-md`}>
      {/* Antennas */}
      <path d="M50 15 L50 5" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
      <circle cx="50" cy="5" r="4" fill="#f43f5e" className={emotion === 'excited' || emotion === 'celebrating' ? 'animate-ping' : ''} />
      
      {/* Head */}
      <rect x="15" y="15" width="70" height="60" rx="12" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
      <rect x="20" y="20" width="60" height="50" rx="8" fill="#f8fafc" />
      
      {/* Screen/Face Background */}
      <rect x="25" y="30" width="50" height="30" rx="4" fill="#1e293b" />
      
      {/* Eyes & Mouth Container */}
      <g transform="translate(25, 30)">
        {/* Dynamic Eyes */}
        {emotion === 'cool' ? (
           <>
            <path d="M5 10 h40 v8 h-40 z" fill="#111" />
            <path d="M5 14 h40" stroke="#333" strokeWidth="1" />
           </>
        ) : emotion === 'thinking' ? (
           <>
            <circle cx="15" cy="12" r="3" fill={eyeColor} />
            <circle cx="35" cy="12" r="5" fill={eyeColor} />
            <path d="M11 5 L19 8" stroke="#cbd5e1" strokeWidth="2" />
           </>
        ) : emotion === 'wink' ? (
           <>
            <circle cx="15" cy="12" r="4" fill={eyeColor} />
            <path d="M31 12 h10" stroke={eyeColor} strokeWidth="3" strokeLinecap="round" />
           </>
        ) : emotion === 'excited' || emotion === 'celebrating' ? (
           <>
            <path d="M11 8 l4 6 h-4 z" fill="#facc15" /> 
            <path d="M31 8 l4 6 h-4 z" fill="#facc15" />
           </>
        ) : (
           <>
            <circle cx="15" cy="12" r="4" fill={eyeColor} />
            <circle cx="35" cy="12" r="4" fill={eyeColor} />
           </>
        )}

        {/* Dynamic Mouth */}
        {emotion === 'happy' || emotion === 'idle' ? (
           <path d="M15 22 q10 5 20 0" stroke={eyeColor} strokeWidth="2" fill="none" strokeLinecap="round" />
        ) : emotion === 'excited' || emotion === 'celebrating' ? (
           <circle cx="25" cy="22" r="5" fill="none" stroke="#f43f5e" strokeWidth="2" />
        ) : emotion === 'thinking' ? (
           <line x1="18" y1="22" x2="32" y2="22" stroke={eyeColor} strokeWidth="2" strokeLinecap="round" />
        ) : emotion === 'cool' ? (
           <path d="M18 24 q7 2 14 0" stroke={eyeColor} strokeWidth="2" fill="none" />
        ) : (
           <path d="M15 22 q10 5 20 0" stroke={eyeColor} strokeWidth="2" fill="none" strokeLinecap="round" />
        )}
      </g>
      
      {/* Ears */}
      <rect x="10" y="35" width="5" height="20" rx="2" fill="#94a3b8" />
      <rect x="85" y="35" width="5" height="20" rx="2" fill="#94a3b8" />
    </svg>
  )
}

export default RobotAvatar
