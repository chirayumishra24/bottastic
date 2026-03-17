import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import useStore from '../store'
import { playClick, playCorrect } from '../utils/sounds'
import { triggerToast } from './AchievementToast'

const observationPrompts = [
  { emoji: '🤔', text: 'What tasks can robots help with in daily life?' },
  { emoji: '🏫', text: 'How can technology help schools run better?' },
  { emoji: '🎮', text: 'What makes robots fun and engaging to use?' },
]

export default function WatchLearn() {
  const { watchReflections, setWatchReflection, setCurrentStep, darkMode, soundEnabled, addXP, unlockAchievement } = useStore()
  const xpGranted = useRef(false)

  useEffect(() => {
    if (!xpGranted.current && watchReflections.useful && watchReflections.reduce) {
      xpGranted.current = true
      addXP(8)
      if (soundEnabled) playCorrect()
      if (unlockAchievement('video-observer')) {
        triggerToast('Video Observer', 'Completed all Watch & Learn reflections!', '📡')
      }
    }
  }, [watchReflections])

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <span className="text-5xl">📡</span>
        <h2 className="text-3xl md:text-4xl font-bold mt-2">
          <span className={`bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent ${darkMode ? 'neon-text' : ''}`}>
            Data Stream: Watch & Learn
          </span>
        </h2>
        <p className={`mt-2 font-mono ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          [Module 1.2] – How Robots Help Us
        </p>
      </motion.div>

      {/* Video Placeholder */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className={`rounded-lg overflow-hidden mb-8 ${darkMode ? 'robo-card neon-glow' : 'robo-card-light shadow-lg'}`}
      >
        <div className={`aspect-video flex flex-col items-center justify-center text-white ${darkMode ? 'bg-gradient-to-br from-gray-900 via-cyan-950 to-gray-900' : 'bg-gradient-to-br from-cyan-700 to-emerald-700'}`}>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            🎬
          </motion.div>
          <h3 className="text-2xl font-bold mb-2">How Robots Help Us</h3>
          <p className="text-sm opacity-80">Video content about robots in everyday life</p>
          <div className="mt-4 flex gap-3">
            <div className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm flex items-center gap-2 font-mono">
              <span>▶</span> Watch Video
            </div>
          </div>
        </div>
        <div className="p-4">
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            🎓 Watch this video and think about how robots could assist in schools, especially with managing lost items.
          </p>
        </div>
      </motion.div>

      {/* Observation Prompts */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className={`p-6 rounded-lg mb-8 ${darkMode ? 'robo-card' : 'robo-card-light shadow-md'}`}
      >
        <h3 className="text-xl font-bold mb-4">🔍 Observation Protocol</h3>
        <div className="space-y-3">
          {observationPrompts.map((prompt, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                darkMode ? 'bg-gray-900/50 border border-cyan-500/10' : 'bg-cyan-50'
              }`}
            >
              <span className="text-2xl">{prompt.emoji}</span>
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                {prompt.text}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Reflection Inputs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className={`p-6 rounded-lg mb-8 ${darkMode ? 'robo-card' : 'robo-card-light shadow-md'}`}
      >
        <h3 className="text-xl font-bold mb-4">⌨️ Data Entry: Reflections</h3>
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Why would a robot be useful in school?
            </label>
            <select
              value={watchReflections.useful}
              onChange={(e) => { setWatchReflection('useful', e.target.value); if (soundEnabled) playCorrect() }}
              className={`w-full p-3 rounded-lg border-2 transition-colors outline-none font-mono cursor-pointer ${
                darkMode
                  ? 'bg-gray-900/50 border-cyan-500/20 focus:border-cyan-500 text-cyan-100'
                  : 'bg-gray-50 border-gray-300 focus:border-cyan-500'
              }`}
            >
              <option value="">– Pick one –</option>
              <option value="It can find lost items quickly">It can find lost items quickly 🔍</option>
              <option value="It saves time for students and teachers">It saves time for students and teachers ⏰</option>
              <option value="It reminds students to be responsible">It reminds students to be responsible 📢</option>
              <option value="It makes the school more organized">It makes the school more organized 🏫</option>
              <option value="It uses technology to solve problems">It uses technology to solve problems 💡</option>
            </select>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              How can a robot reduce lost items?
            </label>
            <select
              value={watchReflections.reduce}
              onChange={(e) => { setWatchReflection('reduce', e.target.value); if (soundEnabled) playCorrect() }}
              className={`w-full p-3 rounded-lg border-2 transition-colors outline-none font-mono cursor-pointer ${
                darkMode
                  ? 'bg-gray-900/50 border-cyan-500/20 focus:border-cyan-500 text-cyan-100'
                  : 'bg-gray-50 border-gray-300 focus:border-cyan-500'
              }`}
            >
              <option value="">– Pick one –</option>
              <option value="By scanning and identifying items automatically">By scanning and identifying items automatically 📡</option>
              <option value="By sending alerts to the owner">By sending alerts to the owner 🔔</option>
              <option value="By tracking where items are left">By tracking where items are left 📍</option>
              <option value="By keeping a smart lost-and-found log">By keeping a smart lost-and-found log 📋</option>
              <option value="By reminding students before they leave">By reminding students before they leave ⏱️</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(1)}
          className={`px-6 py-3 rounded-lg font-medium font-mono transition-colors ${
            darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-400 border border-gray-700' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          ◀ Back
        </button>
        <button
          onClick={() => { if (soundEnabled) playClick(); setCurrentStep(3) }}
          className={`px-6 py-3 font-medium font-mono rounded-lg transition-all ${
            darkMode
              ? 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-black hover:shadow-[0_0_15px_rgba(0,255,200,0.3)]'
              : 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-white hover:shadow-lg'
          }`}
        >
          Next: Quiz Time! ▶
        </button>
      </div>
    </div>
  )
}
