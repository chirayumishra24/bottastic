import { useEffect, useRef } from 'react'

const PARTICLE_COUNT = 60

export default function ParticleField({ darkMode }) {
  const canvasRef = useRef(null)
  const mouse = useRef({ x: -9999, y: -9999 })
  const animRef = useRef(null)
  const particles = useRef([])

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

    // Kid-friendly tech colors
    const colors = [
      '#0ea5e9', // cyan-500
      '#8b5cf6', // violet-500
      '#10b981', // emerald-500
      '#f59e0b', // amber-500
      '#f43f5e', // rose-500
    ]

    const shapeTypes = ['gear', 'star', 'hex', 'bolt', 'circle', 'square']

    // Initialize particles
    particles.current = Array.from({ length: PARTICLE_COUNT }, () => {
      const isShape = Math.random() < 0.4 // 40% shapes, 60% dots
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: isShape ? 12 + Math.random() * 10 : 2 + Math.random() * 3,
        type: isShape ? shapeTypes[Math.floor(Math.random() * shapeTypes.length)] : 'dot',
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.05,
      }
    })

    const onMouseMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMouseMove)

    // Drawing Helpers
    const drawGear = (ctx, x, y, size, color) => {
      const outerRadius = size
      const innerRadius = size * 0.8
      const holeRadius = size * 0.3
      const teeth = 8
      
      ctx.beginPath()
      for (let i = 0; i < teeth * 2; i++) {
        const angle = (Math.PI * 2 * i) / (teeth * 2)
        const r = (i % 2 === 0) ? outerRadius : innerRadius
        ctx.lineTo(x + Math.cos(angle) * r, y + Math.sin(angle) * r)
      }
      ctx.closePath()
      
      // Gradient fill for 3D look
      const grad = ctx.createRadialGradient(x-size/3, y-size/3, size/10, x, y, size)
      grad.addColorStop(0, '#ffffff')
      grad.addColorStop(0.3, color)
      grad.addColorStop(1, '#111827')
      ctx.fillStyle = grad
      ctx.fill()

      // Center hole
      ctx.beginPath()
      ctx.arc(x, y, holeRadius, 0, Math.PI * 2)
      ctx.fillStyle = darkMode ? '#0f172a' : '#f3f4f6' // hole color matching bg
      ctx.fill()
    }

    const drawStar = (ctx, x, y, size, color) => {
      const spikes = 5
      const outer = size
      const inner = size * 0.5
      
      ctx.beginPath()
      for(let i=0; i<spikes*2; i++){
        const r = (i%2 === 0) ? outer : inner
        const a = (Math.PI / spikes) * i - Math.PI/2
        ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r)
      }
      ctx.closePath()
      
      const grad = ctx.createLinearGradient(x-size, y-size, x+size, y+size)
      grad.addColorStop(0, color)
      grad.addColorStop(1, '#ffffff')
      ctx.fillStyle = grad
      ctx.fill()
      
      // Bevel effect
      ctx.lineWidth = 1
      ctx.strokeStyle = 'rgba(255,255,255,0.4)'
      ctx.stroke()
    }

    const drawHex = (ctx, x, y, size, color) => {
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i
        ctx.lineTo(x + Math.cos(angle) * size, y + Math.sin(angle) * size)
      }
      ctx.closePath()
      ctx.strokeStyle = color
      ctx.lineWidth = 3
      ctx.stroke()
      ctx.fillStyle = color + '40' // transparent fill
      ctx.fill()
    }

    const drawBolt = (ctx, x, y, size, color) => {
      ctx.beginPath()
      // Simple lightning bolt shape
      ctx.moveTo(x + size*0.3, y - size)
      ctx.lineTo(x - size*0.3, y + size*0.1)
      ctx.lineTo(x + size*0.1, y + size*0.1)
      ctx.lineTo(x - size*0.3, y + size)
      ctx.lineTo(x + size*0.3, y - size*0.1)
      ctx.lineTo(x - size*0.1, y - size*0.1)
      ctx.closePath()
      
      ctx.shadowColor = color
      ctx.shadowBlur = 10
      ctx.fillStyle = '#fbbf24' // always gold/yellow for bolt
      ctx.fill()
      ctx.shadowBlur = 0
    }

    const animate = () => {
      // Clear with slight trail effect? No, clean clear
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Update & Draw Particles
      particles.current.forEach(p => {
        // Physics
        const dx = p.x - mouse.current.x
        const dy = p.y - mouse.current.y
        const dist = Math.sqrt(dx*dx + dy*dy)
        const repelRange = 140

        if (dist < repelRange) {
          const force = (repelRange - dist) / repelRange
          const angle = Math.atan2(dy, dx)
          p.vx += Math.cos(angle) * force * 0.8
          p.vy += Math.sin(angle) * force * 0.8
        }

        p.x += p.vx
        p.y += p.vy
        p.angle += p.rotationSpeed
        
        // Friction
        p.vx *= 0.98
        p.vy *= 0.98

        // Constant float
        if (Math.abs(p.vx) < 0.1) p.vx += (Math.random()-0.5) * 0.02
        if (Math.abs(p.vy) < 0.1) p.vy += (Math.random()-0.5) * 0.02

        // Wrap edges
        if (p.x < -40) p.x = canvas.width + 40
        if (p.x > canvas.width + 40) p.x = -40
        if (p.y < -40) p.y = canvas.height + 40
        if (p.y > canvas.height + 40) p.y = -40

        // Draw
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.angle)

        if (p.type === 'dot') {
          ctx.beginPath()
          ctx.arc(0, 0, p.size, 0, Math.PI*2)
          ctx.fillStyle = darkMode ? p.color + '80' : p.color + '60'
          ctx.fill()
        } else {
          // Add drop shadow for 3D feel
          ctx.shadowColor = 'rgba(0,0,0,0.2)'
          ctx.shadowBlur = 5
          ctx.shadowOffsetY = 3
          
          if (p.type === 'gear') drawGear(ctx, 0, 0, p.size, p.color)
          else if (p.type === 'star') drawStar(ctx, 0, 0, p.size, p.color)
          else if (p.type === 'hex') drawHex(ctx, 0, 0, p.size, p.color)
          else if (p.type === 'bolt') drawBolt(ctx, 0, 0, p.size, p.color)
          else if (p.type === 'circle') {
             ctx.beginPath()
             ctx.arc(0,0,p.size,0,Math.PI*2)
             ctx.strokeStyle = p.color
             ctx.lineWidth = 3
             ctx.stroke()
          }
          else if (p.type === 'square') {
             ctx.fillStyle = p.color
             ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size)
             // inner square
             ctx.fillStyle = 'rgba(255,255,255,0.3)'
             ctx.fillRect(-p.size/4, -p.size/4, p.size/2, p.size/2)
          }
        }
        ctx.restore()
      })

      // Connecting lines
      ctx.lineWidth = 1
      for (let i=0; i<particles.current.length; i++) {
        const p1 = particles.current[i]
        for (let j=i+1; j<particles.current.length; j++) {
          const p2 = particles.current[j]
          // Don't connect shapes, only dots or mixed
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist = Math.sqrt(dx*dx + dy*dy)
          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            const alpha = (1 - dist/100) * 0.15
            ctx.strokeStyle = darkMode 
               ? `rgba(255,255,255,${alpha})` 
               : `rgba(0,0,0,${alpha*0.6})`
            ctx.stroke()
          }
        }
      }

      animRef.current = requestAnimationFrame(animate)
    }
    
    animate()

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [darkMode])

  return (
    <canvas
      ref={canvasRef}
      data-html2canvas-ignore="true"
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: darkMode ? 0.9 : 0.6 }}
    />
  )
}
