import { useEffect, useRef, useState } from 'react'
import { playLevelUp } from '../utils/sounds'
import useStore from '../store'

// ↑ ↑ ↓ ↓ ← → ← → B A
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

export default function KonamiEasterEgg() {
  const { addXP, soundEnabled, unlockAchievement } = useStore()
  const [activated, setActivated] = useState(false)
  const [showSecret, setShowSecret] = useState(false)
  const progress = useRef(0)

  useEffect(() => {
    const handleKey = (e) => {
      const expected = KONAMI[progress.current]
      if (e.key === expected || e.key.toLowerCase() === expected) {
        progress.current++
        if (progress.current === KONAMI.length) {
          progress.current = 0
          if (!activated) {
            setActivated(true)
            setShowSecret(true)
            addXP(25)
            if (soundEnabled) playLevelUp()
            unlockAchievement('konami-master')

            // Flash the page
            document.body.classList.add('konami-flash')
            setTimeout(() => document.body.classList.remove('konami-flash'), 1000)

            // Trigger massive confetti
            import('canvas-confetti').then((mod) => {
              const confetti = mod.default
              const end = Date.now() + 4000
              const tick = () => {
                confetti({
                  particleCount: 8,
                  angle: 60 + Math.random() * 60,
                  spread: 80,
                  origin: { x: Math.random(), y: Math.random() * 0.6 },
                  colors: ['#ff0080', '#00ff80', '#0080ff', '#ff8000', '#8000ff', '#00ffc8'],
                })
                if (Date.now() < end) requestAnimationFrame(tick)
              }
              tick()
            }).catch(() => {})

            setTimeout(() => setShowSecret(false), 6000)
          }
        }
      } else {
        progress.current = 0
        // Check if it matches the start
        if (e.key === KONAMI[0]) progress.current = 1
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [activated, addXP, soundEnabled, unlockAchievement])

  if (!showSecret) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          background: 'rgba(0,0,0,0.85)',
          borderRadius: '20px',
          padding: '40px 60px',
          textAlign: 'center',
          border: '2px solid #00ffc8',
          boxShadow: '0 0 60px rgba(0, 255, 200, 0.4), 0 0 120px rgba(0, 255, 200, 0.1)',
          animation: 'bounce-in 0.5s ease-out',
        }}
      >
        <div style={{ fontSize: '64px', marginBottom: '10px' }}>🏆🎮🤖</div>
        <div
          className="glitch-text"
          style={{
            fontSize: '28px',
            fontWeight: 'bold',
            fontFamily: 'Orbitron, sans-serif',
            color: '#00ffc8',
            marginBottom: '8px',
          }}
        >
          SECRET UNLOCKED!
        </div>
        <div style={{ color: '#aaa', fontFamily: 'Share Tech Mono, monospace', fontSize: '14px' }}>
          You found the Konami Code! +25 XP 🎉
        </div>
        <div style={{ color: '#666', fontFamily: 'Share Tech Mono, monospace', fontSize: '11px', marginTop: '8px' }}>
          ↑ ↑ ↓ ↓ ← → ← → B A
        </div>
      </div>
    </div>
  )
}
