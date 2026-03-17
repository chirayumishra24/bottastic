import { useRef, useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import useStore from '../store'
import { playClick, playPop } from '../utils/sounds'
import { triggerToast } from './AchievementToast'

const colors = ['#000000', '#FF0000', '#0000FF', '#00AA00', '#FF6600', '#9900CC', '#FF69B4', '#FFD700']
const emojiStickers = ['🤖', '⭐', '❤️', '🔍', '🔔', '💡', '🎯', '🧴', '📦', '🎒', '👁️', '🦾']

export default function DrawingCanvas() {
  const { drawingData, setDrawingData, setCurrentStep, darkMode, soundEnabled, addXP, unlockAchievement } = useStore()
  const xpGranted = useRef(false)
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#000000')
  const [brushSize, setBrushSize] = useState(3)
  const [tool, setTool] = useState('pen')
  const [showEmojis, setShowEmojis] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    if (drawingData) {
      const img = new Image()
      img.onload = () => ctx.drawImage(img, 0, 0)
      img.src = drawingData
    }
  }, [])

  const getPos = useCallback((e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    }
  }, [])

  const startDraw = useCallback((e) => {
    e.preventDefault()
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const pos = getPos(e)
    setIsDrawing(true)

    if (tool === 'pen' || tool === 'eraser') {
      ctx.beginPath()
      ctx.moveTo(pos.x, pos.y)
      ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color
      ctx.lineWidth = tool === 'eraser' ? brushSize * 3 : brushSize
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
    }
  }, [tool, color, brushSize, getPos])

  const draw = useCallback((e) => {
    e.preventDefault()
    if (!isDrawing) return
    const ctx = canvasRef.current.getContext('2d')
    const pos = getPos(e)

    if (tool === 'pen' || tool === 'eraser') {
      ctx.lineTo(pos.x, pos.y)
      ctx.stroke()
    }
  }, [isDrawing, tool, getPos])

  const stopDraw = useCallback((e) => {
    if (e) e.preventDefault()
    setIsDrawing(false)
    const canvas = canvasRef.current
    if (canvas) {
      setDrawingData(canvas.toDataURL())
      if (!xpGranted.current) {
        xpGranted.current = true
        addXP(10)
        if (soundEnabled) playPop()
        if (unlockAchievement('artist')) {
          triggerToast('Digital Artist!', 'Created your first robot blueprint!', '\u{1F3A8}')
        }
      }
    }
  }, [setDrawingData])

  const addEmoji = (emoji) => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const x = canvas.width / 2
    const y = canvas.height / 2
    ctx.font = '48px serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(emoji, x, y)
    setDrawingData(canvas.toDataURL())
    setShowEmojis(false)
  }

  const addShape = (shape) => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const cx = canvas.width / 2
    const cy = canvas.height / 2
    ctx.strokeStyle = color
    ctx.lineWidth = brushSize

    if (shape === 'circle') {
      ctx.beginPath()
      ctx.arc(cx, cy, 40, 0, Math.PI * 2)
      ctx.stroke()
    } else if (shape === 'rect') {
      ctx.strokeRect(cx - 40, cy - 30, 80, 60)
    } else if (shape === 'triangle') {
      ctx.beginPath()
      ctx.moveTo(cx, cy - 40)
      ctx.lineTo(cx - 40, cy + 30)
      ctx.lineTo(cx + 40, cy + 30)
      ctx.closePath()
      ctx.stroke()
    }
    setDrawingData(canvas.toDataURL())
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    setDrawingData(null)
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <span className="text-5xl">✍️</span>
        <h2 className="text-3xl md:text-4xl font-bold mt-2">
          <span className={`bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent ${darkMode ? 'neon-text' : ''}`}>
            Design Interface
          </span>
        </h2>
        <p className={`mt-2 font-mono ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Render your unit blueprint!
        </p>
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`p-4 rounded-lg mb-4 ${darkMode ? 'robo-card' : 'robo-card-light shadow-md'}`}
      >
        <div className="flex flex-wrap items-center gap-3">
          {/* Tools */}
          <div className="flex gap-1">
            {[
              { value: 'pen', label: '✏️' },
              { value: 'eraser', label: '🧹' },
            ].map((t) => (
              <button
                key={t.value}
                onClick={() => setTool(t.value)}
                className={`w-10 h-10 rounded-md flex items-center justify-center text-lg transition-all ${
                  tool === t.value
                    ? 'bg-cyan-500 text-black shadow-md'
                    : darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="w-px h-8 bg-gray-300 dark:bg-gray-600" />

          {/* Colors */}
          <div className="flex gap-1">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => { setColor(c); setTool('pen') }}
                className={`w-7 h-7 rounded-md border-2 transition-transform ${
                  color === c && tool === 'pen' ? 'scale-125 border-cyan-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          <div className="w-px h-8 bg-gray-300 dark:bg-gray-600" />

          {/* Brush size */}
          <div className="flex items-center gap-2">
            <span className="text-xs">Size:</span>
            <input
              type="range"
              min="1"
              max="10"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-20"
            />
          </div>

          <div className="w-px h-8 bg-gray-300 dark:bg-gray-600" />

          {/* Shapes */}
          <div className="flex gap-1">
            <button onClick={() => addShape('circle')} className={`w-8 h-8 rounded-md text-sm ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}>⭕</button>
            <button onClick={() => addShape('rect')} className={`w-8 h-8 rounded-md text-sm ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}>⬜</button>
            <button onClick={() => addShape('triangle')} className={`w-8 h-8 rounded-md text-sm ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}>🔺</button>
          </div>

          <div className="w-px h-8 bg-gray-300 dark:bg-gray-600" />

          {/* Emoji */}
          <div className="relative">
            <button
              onClick={() => setShowEmojis(!showEmojis)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium font-mono ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-emerald-400 border border-gray-700' : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'}`}
            >
              😎 Stickers
            </button>
            {showEmojis && (
              <div className={`absolute top-full left-0 mt-2 p-2 rounded-lg shadow-lg grid grid-cols-4 gap-1 z-10 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
                {emojiStickers.map((em) => (
                  <button
                    key={em}
                    onClick={() => addEmoji(em)}
                    className="w-10 h-10 text-2xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  >
                    {em}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={clearCanvas}
            className="ml-auto px-3 py-1.5 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
          >
            🗑️ Clear
          </button>
        </div>
      </motion.div>

      {/* Canvas */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="rounded-lg overflow-hidden mb-8 border-2 border-gray-200 dark:border-cyan-500/20"
      >
        <canvas
          ref={canvasRef}
          className="drawing-canvas w-full bg-white"
          style={{ height: '400px' }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(5)}
          className={`px-6 py-3 rounded-lg font-medium font-mono transition-colors ${
            darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-400 border border-gray-700' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          ◀ Back
        </button>
        <button
          onClick={() => setCurrentStep(7)}
          className={`px-6 py-3 font-medium font-mono rounded-lg transition-all ${
            darkMode
              ? 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-black hover:shadow-[0_0_15px_rgba(0,255,200,0.3)]'
              : 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-white hover:shadow-lg'
          }`}
        >
          Next: Create Flyer! ▶
        </button>
      </div>
    </div>
  )
}
