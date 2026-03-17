import { useRef } from 'react'
import { motion } from 'framer-motion'
import useStore from '../store'
import { playLevelUp } from '../utils/sounds'
import { triggerToast } from './AchievementToast'

const featureLabels = {
  scanner: '📡 Item Scanner',
  'owner-finder': '🔍 Owner Finder',
  alerts: '🔔 Smart Alerts',
  voice: '🗣️ Voice Messages',
  tracking: '📍 Item Tracking',
}

const personalityLabels = {
  funny: '😂 Funny',
  detective: '🕵️ Detective',
  energetic: '⚡ Energetic',
  friendly: '🤗 Friendly',
}

export default function FlyerPreview() {
  const { robotData, drawingData, teamInfo, setCurrentStep, darkMode, soundEnabled, addXP, unlockAchievement } = useStore()
  const flyerRef = useRef(null)
  const exportedRef = useRef(false)

  const exportFlyer = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(flyerRef.current, { scale: 2, backgroundColor: '#ffffff' })
      const link = document.createElement('a')
      link.download = `${robotData.name || 'robot'}-flyer.png`
      link.href = canvas.toDataURL()
      link.click()
      if (!exportedRef.current) {
        exportedRef.current = true
        addXP(10)
        if (soundEnabled) playLevelUp()
        if (unlockAchievement('flyer-exported')) {
          triggerToast('Marketing Guru!', 'Exported your first robot flyer!', '\ud83d\udce4')
        }
      }
    } catch {
      alert('Export feature requires html2canvas. Please check your internet connection.')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <span className="text-5xl">�</span>
        <h2 className="text-3xl md:text-4xl font-bold mt-2">
          <span className={`bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent ${darkMode ? 'neon-text' : ''}`}>
            Flyer Generator
          </span>
        </h2>
        <p className={`mt-2 font-mono ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Auto-compiled promotional output!
        </p>
      </motion.div>

      {/* Flyer Preview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center mb-6"
      >
        <div
          ref={flyerRef}
          className="w-full max-w-md bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-200"
        >
          {/* Flyer Header */}
          <div className="bg-gradient-to-r from-gray-900 via-cyan-950 to-gray-900 p-6 text-cyan-100 text-center border-b border-cyan-500/20">
            <div className="text-4xl mb-2">🤖</div>
            <h3 className="text-2xl font-extrabold">
              {robotData.name || 'Your Robot Name'}
            </h3>
            {robotData.personality && (
              <p className="text-sm opacity-90 mt-1">
                {personalityLabels[robotData.personality]}
              </p>
            )}
          </div>

          {/* Tagline */}
          {robotData.tagline && (
            <div className="bg-cyan-500 text-black text-center py-2 px-4 font-bold text-sm font-mono">
              {robotData.tagline}
            </div>
          )}

          {/* Drawing */}
          {drawingData && (
            <div className="p-4 flex justify-center bg-gray-50">
              <img src={drawingData} alt="Robot drawing" className="max-h-48 rounded-xl object-contain" />
            </div>
          )}

          {/* Features */}
          <div className="p-6">
            <h4 className="font-bold text-gray-800 mb-3 text-center">✨ Features</h4>
            <div className="flex flex-wrap justify-center gap-2">
              {robotData.features.length > 0 ? (
                robotData.features.map((f) => (
                  <span key={f} className="px-3 py-1.5 bg-cyan-100 text-cyan-700 rounded-md text-xs font-medium font-mono">
                    {featureLabels[f] || f}
                  </span>
                ))
              ) : (
                <span className="text-gray-400 text-sm italic">No features selected</span>
              )}
            </div>
          </div>

          {/* Description */}
          {robotData.description && (
            <div className="px-6 pb-4">
              <p className="text-sm text-gray-600 text-center italic">
                "{robotData.description}"
              </p>
            </div>
          )}

          {/* Team */}
          {teamInfo.name && (
            <div className="bg-gray-50 p-4 text-center border-t">
              <p className="text-xs text-gray-500 font-mono">
                Built by <span className="font-bold text-cyan-600">{teamInfo.name}</span>
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Export Button */}
      <div className="flex justify-center mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={exportFlyer}
          className={`px-6 py-3 font-medium font-mono rounded-lg shadow-lg transition-all ${
            darkMode
              ? 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-black hover:shadow-[0_0_15px_rgba(0,255,200,0.3)]'
              : 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-white hover:shadow-xl'
          }`}
        >
          📥 Export Flyer as Image
        </motion.button>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(6)}
          className={`px-6 py-3 rounded-lg font-medium font-mono transition-colors ${
            darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-400 border border-gray-700' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          ◀ Back
        </button>
        <button
          onClick={() => setCurrentStep(8)}
          className={`px-6 py-3 font-medium font-mono rounded-lg transition-all ${
            darkMode
              ? 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-black hover:shadow-[0_0_15px_rgba(0,255,200,0.3)]'
              : 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-white hover:shadow-lg'
          }`}
        >
          Next: Present! ▶
        </button>
      </div>
    </div>
  )
}
