import { useEffect, useRef, useCallback } from 'react'

// Click anywhere on the page → emoji particle explosion
const burstEmojis = ['⚡', '✨', '💥', '🔥', '⭐', '💫', '🌟', '🎯', '🤖', '🚀', '💎', '🎵']

export default function ClickBurst() {
  const containerRef = useRef(null)

  const spawnBurst = useCallback((x, y) => {
    const container = containerRef.current
    if (!container) return

    const count = 6 + Math.floor(Math.random() * 4)
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div')
      el.className = 'click-burst-particle'
      el.textContent = burstEmojis[Math.floor(Math.random() * burstEmojis.length)]

      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5
      const distance = 40 + Math.random() * 60
      const dx = Math.cos(angle) * distance
      const dy = Math.sin(angle) * distance

      el.style.left = `${x}px`
      el.style.top = `${y}px`
      el.style.setProperty('--dx', `${dx}px`)
      el.style.setProperty('--dy', `${dy}px`)
      el.style.fontSize = `${14 + Math.random() * 14}px`
      el.style.animationDuration = `${0.5 + Math.random() * 0.3}s`

      container.appendChild(el)
      el.addEventListener('animationend', () => el.remove())
    }
  }, [])

  useEffect(() => {
    const handleClick = (e) => {
      // Don't burst on buttons/inputs/textareas to avoid annoyance
      const tag = e.target.tagName
      if (tag === 'BUTTON' || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'CANVAS') return
      spawnBurst(e.clientX, e.clientY)
    }

    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [spawnBurst])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9998,
        overflow: 'hidden',
      }}
    />
  )
}
