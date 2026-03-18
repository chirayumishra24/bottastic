import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import useStore from '../store'
import { playLevelUp } from '../utils/sounds'
import { triggerToast } from './AchievementToast'

const takeaways = [
  'Robots can solve everyday problems like lost items in schools',
  'Designing a robot requires creativity, teamwork, and smart thinking',
  'Technology is most useful when it helps people in their daily lives',
  'Small ideas can lead to big innovations that change how things work',
  'Presenting your ideas helps others understand and support them',
]

const learningOutcomes = [
  { emoji: '💡', title: 'Creative Thinking', desc: 'You imagined a brand-new robot to solve a real problem!' },
  { emoji: '🧩', title: 'Problem Solving', desc: 'You identified the lost-items problem and designed a solution.' },
  { emoji: '🚀', title: 'Entrepreneurial Mindset', desc: 'You thought like an innovator and creator.' },
  { emoji: '🗣️', title: 'Communication Skills', desc: 'You presented and explained your robot clearly.' },
  { emoji: '🤝', title: 'Collaboration', desc: 'You worked as a team to build something amazing.' },
]

export default function KeyTakeaways() {
  const { setCurrentStep, darkMode, soundEnabled, addXP, xp, getLevel, unlockAchievement, achievements } = useStore()
  const xpGranted = useRef(false)
  const reportRef = useRef(null)
  const [isExportingPdf, setIsExportingPdf] = useState(false)
  const [exportError, setExportError] = useState('')

  useEffect(() => {
    import('canvas-confetti').then((mod) => {
      const confetti = mod.default
      const duration = 3000
      const end = Date.now() + duration
      const tick = () => {
        confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 } })
        confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 } })
        if (Date.now() < end) requestAnimationFrame(tick)
      }
      tick()
    }).catch(() => {})

    if (!xpGranted.current) {
      xpGranted.current = true
      addXP(20)
      if (soundEnabled) playLevelUp()
      if (unlockAchievement('mission-complete')) {
        triggerToast('Mission Complete!', 'You finished the entire Bot-tastic challenge!', '\ud83c\udf1f')
      }
    }
  }, [])

  const level = getLevel()
  const achievementCount = Object.keys(achievements).length

  const exportAsPdf = async () => {
    if (isExportingPdf || !reportRef.current) return

    setIsExportingPdf(true)
    setExportError('')

    try {
      if (document.fonts?.ready) await document.fonts.ready

      const html2canvas = (await import('html2canvas')).default
      const { jsPDF } = await import('jspdf')

      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
      })

      const imageData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const imageWidth = pageWidth
      const imageHeight = (canvas.height * imageWidth) / canvas.width

      let heightLeft = imageHeight
      let position = 0

      pdf.addImage(imageData, 'PNG', 0, position, imageWidth, imageHeight)
      heightLeft -= pageHeight

      while (heightLeft > 0) {
        position = heightLeft - imageHeight
        pdf.addPage()
        pdf.addImage(imageData, 'PNG', 0, position, imageWidth, imageHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`bot-tastic-final-report-level-${level.level}.pdf`)
    } catch (error) {
      console.error('PDF export failed:', error)
      setExportError('PDF export could not finish. Please try again once the report is fully visible.')
    } finally {
      setIsExportingPdf(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div ref={reportRef}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl"
          >
            🎓
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">
            <span className={`bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent ${darkMode ? 'neon-text' : ''}`}>
              Final Report
            </span>
          </h2>
          <p className={`mt-2 font-mono ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            [Module 2.3] – Knowledge Archive
          </p>
        </motion.div>

        {/* Takeaways */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-lg mb-8 ${darkMode ? 'bg-gradient-to-r from-cyan-900 to-emerald-900 text-cyan-100 neon-glow-cyan' : 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-white shadow-lg'}`}
        >
          <h3 className="text-xl font-bold mb-4 text-center">📏 Core Data Logged</h3>
          <div className="space-y-3">
            {takeaways.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.15 }}
                className="flex items-center gap-3 bg-white/10 rounded-lg p-3 border border-white/10"
              >
                <span className="text-2xl">✨</span>
                <span className="font-medium">{t}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Learning Outcomes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className={`p-6 rounded-lg mb-8 ${darkMode ? 'robo-card' : 'robo-card-light shadow-md'}`}
        >
          <h3 className="text-xl font-bold mb-4 text-center">🎯 Skill Modules Unlocked</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {learningOutcomes.map((lo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                whileHover={{ scale: 1.03, y: -3 }}
                className={`p-4 rounded-lg text-center transition-shadow hover:shadow-lg ${
                  darkMode ? 'bg-gray-900/50 border border-cyan-500/10' : 'bg-gradient-to-b from-cyan-50 to-emerald-50'
                }`}
              >
                <div className="text-4xl mb-2">{lo.emoji}</div>
                <div className="font-bold text-sm mb-1">{lo.title}</div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{lo.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* XP & Level Summary */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className={`p-6 rounded-lg mb-8 text-center ${darkMode ? 'robo-card neon-glow' : 'robo-card-light shadow-lg'}`}
        >
          <h3 className="text-xl font-bold mb-4">🏆 Your Stats</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-900/50' : 'bg-cyan-50'}`}>
              <div className="text-3xl mb-1">{level.emoji}</div>
              <div className={`font-bold text-sm ${darkMode ? 'text-cyan-400' : 'text-cyan-700'}`}>{level.name}</div>
              <div className={`text-xs font-mono ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Level {level.level}</div>
            </div>
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-900/50' : 'bg-emerald-50'}`}>
              <div className="text-3xl font-bold text-emerald-400 mb-1">{xp}</div>
              <div className={`font-bold text-sm ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>Total XP</div>
              <div className={`text-xs font-mono ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Earned</div>
            </div>
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-900/50' : 'bg-yellow-50'}`}>
              <div className="text-3xl font-bold text-yellow-400 mb-1">{achievementCount}</div>
              <div className={`font-bold text-sm ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>Badges</div>
              <div className={`text-xs font-mono ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Unlocked</div>
            </div>
          </div>
        </motion.div>

        {/* Completion Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className="text-center mb-8"
        >
          <div className="text-5xl mb-4">⚡</div>
          <h3 className="text-2xl font-bold mb-2 rainbow-glow">
            Mission Complete!
          </h3>
          <p className={`text-base font-mono ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Bot-tastic School Buddy Challenge: STATUS = SUCCESS ✓
          </p>
          <p className={`text-sm mt-1 font-mono ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            You are now a certified {level.name}! Keep building! ⚡
          </p>
        </motion.div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
        <button
          onClick={() => setCurrentStep(9)}
          className={`px-6 py-3 rounded-lg font-medium font-mono transition-colors ${
            darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-400 border border-gray-700' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          ◀ Back to Points
        </button>
        <button
          onClick={exportAsPdf}
          disabled={isExportingPdf}
          className={`px-6 py-3 font-medium font-mono rounded-lg transition-all ${
            darkMode
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:shadow-[0_0_15px_rgba(251,191,36,0.35)] disabled:opacity-60'
              : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg disabled:opacity-60'
          }`}
        >
          {isExportingPdf ? 'Preparing PDF...' : '📄 Export Final Report as PDF'}
        </button>
        <button
          onClick={() => setCurrentStep(0)}
          className={`px-6 py-3 font-medium font-mono rounded-lg transition-all ${
            darkMode
              ? 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-black hover:shadow-[0_0_15px_rgba(0,255,200,0.3)]'
              : 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-white hover:shadow-lg'
          }`}
        >
          🏠 Return to Base
        </button>
      </div>
      {exportError && (
        <p className={`text-center text-sm mb-8 ${darkMode ? 'text-red-300' : 'text-red-600'}`}>
          {exportError}
        </p>
      )}
    </div>
  )
}
