import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { playAchievement } from '../utils/sounds'

let toastQueue = []
let showToastFn = null

export function triggerToast(title, description, emoji = '🏆') {
  if (showToastFn) {
    showToastFn({ title, description, emoji, id: Date.now() })
  }
}

export default function AchievementToast({ darkMode }) {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    showToastFn = (toast) => {
      playAchievement()
      setToasts(prev => [...prev, toast])
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id))
      }, 4000)
    }
    return () => { showToastFn = null }
  }, [])

  return (
    <div className="fixed top-24 right-4 z-[200] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl min-w-[280px] max-w-sm ${
              darkMode
                ? 'bg-gradient-to-r from-gray-800 to-gray-900 border border-yellow-500/40 text-white'
                : 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-300 text-gray-800'
            }`}
          >
            <motion.div
              animate={{ rotate: [0, -15, 15, -15, 0], scale: [1, 1.3, 1] }}
              transition={{ duration: 0.6 }}
              className="text-3xl"
            >
              {toast.emoji}
            </motion.div>
            <div>
              <div className="font-bold text-sm">{toast.title}</div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {toast.description}
              </div>
            </div>
            <motion.div
              className="absolute inset-0 rounded-xl border-2 border-yellow-400/50"
              animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
