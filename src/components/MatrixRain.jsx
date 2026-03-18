import { useEffect, useRef } from 'react'

// Animated falling characters background (Matrix Rain / Cyber Grid style)
export default function MatrixRain({ darkMode }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const chars = '01アイウエオカキクケコ⚡🤖⭐💡🔧⚙️'
    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)
    const drops = Array(columns).fill(0).map(() => Math.random() * -50)

    const draw = () => {
      // Semi-transparent bg for fade effect
      ctx.fillStyle = darkMode ? 'rgba(10, 14, 23, 0.08)' : 'rgba(232, 237, 245, 0.08)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = `${fontSize}px 'Share Tech Mono', monospace`

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        // Color variations
        const brightness = Math.random()
        if (darkMode) {
          if (brightness > 0.95) {
            ctx.fillStyle = '#00ffc8'
            ctx.shadowBlur = 10
            ctx.shadowColor = '#00ffc8'
          } else if (brightness > 0.8) {
            ctx.fillStyle = 'rgba(0, 255, 200, 0.6)'
            ctx.shadowBlur = 0
          } else {
            ctx.fillStyle = 'rgba(0, 255, 200, 0.15)'
            ctx.shadowBlur = 0
          }
        } else {
          if (brightness > 0.95) {
            ctx.fillStyle = 'rgba(6, 182, 212, 0.5)'
            ctx.shadowBlur = 5
            ctx.shadowColor = '#06b6d4'
          } else {
            ctx.fillStyle = 'rgba(6, 182, 212, 0.08)'
            ctx.shadowBlur = 0
          }
        }

        ctx.fillText(char, x, y)
        ctx.shadowBlur = 0

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i] += 0.5
      }
    }

    const interval = setInterval(draw, 50)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', resize)
    }
  }, [darkMode])

  return (
    <canvas
      ref={canvasRef}
      data-html2canvas-ignore="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
