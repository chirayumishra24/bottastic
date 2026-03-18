import { useEffect, useRef } from 'react'

// Canvas-based sparkle trail that follows the cursor
export default function CursorTrail() {
  const canvasRef = useRef(null)
  const particles = useRef([])
  const mouse = useRef({ x: -100, y: -100 })
  const raf = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const colors = ['#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#00ffc8', '#ff6b6b']

    const handleMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      // Spawn 2-3 sparkles per move
      for (let i = 0; i < 2; i++) {
        particles.current.push({
          x: e.clientX + (Math.random() - 0.5) * 10,
          y: e.clientY + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2 - 1,
          life: 1,
          decay: 0.015 + Math.random() * 0.02,
          size: 2 + Math.random() * 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          type: Math.random() > 0.5 ? 'star' : 'circle',
        })
      }
      // Cap particles
      if (particles.current.length > 80) {
        particles.current = particles.current.slice(-80)
      }
    }

    const drawStar = (ctx, x, y, size) => {
      ctx.beginPath()
      for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2
        const method = i === 0 ? 'moveTo' : 'lineTo'
        ctx[method](x + Math.cos(angle) * size, y + Math.sin(angle) * size)
      }
      ctx.closePath()
      ctx.fill()
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particles.current) {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.02 // slight gravity
        p.life = Math.max(0, p.life - p.decay)
        if (p.life <= 0) continue

        const drawSize = Math.max(p.size * p.life, 0.1)

        ctx.globalAlpha = p.life * 0.8
        ctx.fillStyle = p.color
        ctx.shadowBlur = 8
        ctx.shadowColor = p.color

        if (p.type === 'star') {
          drawStar(ctx, p.x, p.y, drawSize)
        } else {
          ctx.beginPath()
          ctx.arc(p.x, p.y, drawSize, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      particles.current = particles.current.filter(p => p.life > 0)
      ctx.globalAlpha = 1
      ctx.shadowBlur = 0

      raf.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMove)
    raf.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  )
}
