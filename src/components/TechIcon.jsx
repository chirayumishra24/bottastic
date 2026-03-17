import React from 'react'

const TechIcon = ({ type, className = "w-6 h-6", color = "currentColor" }) => {
  if (type === 'bolt') {
    return (
      <svg viewBox="0 0 24 24" fill={color} className={className}>
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    )
  }
  if (type === 'wrench') {
    return (
      <svg viewBox="0 0 24 24" fill={color} className={className}>
         <path d="M14.7 13.3a8.1 8.1 0 1 1 2.3-6.2l-3.2 2.7a4.2 4.2 0 1 0-.9 3zm-3.3 1.4-9.3 9.3a2 2 0 0 0 2.8 2.8l9.3-9.3-2.8-2.8z"/>
      </svg>
    )
  }
  if (type === 'lightbulb') {
    return (
      <svg viewBox="0 0 24 24" fill={color} className={className}>
         <path d="M9 21h6v-2H9v2zm3-19C8.48 2 5.5 4.98 5.5 8.5c0 2.37 1.34 4.43 3.32 5.64.44.27.68.75.68 1.25V18h5v-2.61c0-.5.24-.98.68-1.25 1.98-1.21 3.32-3.27 3.32-5.64C18.5 4.98 15.52 2 12 2z"/>
      </svg>
    )
  }
  if (type === 'star') {
    return (
      <svg viewBox="0 0 24 24" fill={color} className={className}>
         <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    )
  }
  if (type === 'search') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    )
  }
  if (type === 'bell') {
    return (
      <svg viewBox="0 0 24 24" fill={color} className={className}>
         <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
         <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
      </svg>
    )
  }
  if (type === 'id-card') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="3" y="4" width="18" height="16" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <circle cx="12" cy="11" r="4"></circle>
        <path d="M16 19a4 4 0 0 0-8 0"></path>
      </svg>
    )
  }
  if (type === 'arm') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
      </svg>
    )
  }
  if (type === 'mask') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
         <path d="M2.5 12h2.5c2 0 3-1 3-2 1-3 5-3 6 0 1 1 2 2 4 2h2.5c.3 0 .5-.2.5-.5V8c0-3.3-2.7-6-6-6S9 4.7 9 8v3.5c0 .3.2.5.5.5Z"/>
         <path d="M16.5 13.5c1 1 2.5 1 3.5 0"/>
         <path d="M4 13.5c1 1 2.5 1 3.5 0"/>
      </svg>
    )
  }
  if (type === 'sliders') {
    return (
       <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <line x1="4" y1="21" x2="4" y2="14"></line>
          <line x1="4" y1="10" x2="4" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12" y2="3"></line>
          <line x1="20" y1="21" x2="20" y2="16"></line>
          <line x1="20" y1="12" x2="20" y2="3"></line>
          <line x1="1" y1="14" x2="7" y2="14"></line>
          <line x1="9" y1="8" x2="15" y2="8"></line>
          <line x1="17" y1="16" x2="23" y2="16"></line>
       </svg>
    )
  }
  if (type === 'party') {
    return (
       <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="m8 18 2-2h2l5-5-2-2-5 5v2H8l-2 2"></path>
          <path d="M5 21a2 2 0 0 1-2-2"></path>
          <path d="M19 3a2 2 0 0 1 2 2"></path>
          <path d="M2 14c2-2 4-4 4-8 .5-1.5 2-2.5 4-2.5 2.5 0 4 1.5 4.5 3 .5 1.5-1 3.5-3 5.5"></path>
          <path d="m14 10 5.5-5.5"></path>
          <path d="m15.5 11.5 5.5-5.5"></path>
       </svg>
    )
  }
  return null
}

export default TechIcon
