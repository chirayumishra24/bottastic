import { useState } from 'react'
import { motion } from 'framer-motion'
import useStore from '../store'
import { playClick, playPop } from '../utils/sounds'
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

const roleplayOptions = [
  'Our robot scans lost items and sends alerts to the owner instantly!',
  'Meet our bot — it detects, identifies, and returns items with a smile!',
  'Our robot uses smart sensors to track items and reminds students to collect them.',
  'This friendly bot patrols the school, finds lost items, and announces them!',
  'Our robot keeps a digital log of all items and matches them to owners automatically.',
]

const discussionQuestionOptions = [
  'How does your robot identify the owner of a lost item?',
  'What makes your robot fun and friendly for students?',
  'Can your robot work in other places besides school?',
  'What happens if the robot finds an item but can\'t find the owner?',
  'How does your robot encourage students to be more responsible?',
  'What special features make your robot different from others?',
  'Would your robot work at night or only during school hours?',
]

export default function Presentation() {
  const {
    robotData, teamInfo, drawingData, roleplayText, setRoleplayText,
    questions, addQuestion, addBrowniePoint, setCurrentStep, darkMode,
    soundEnabled, addXP, unlockAchievement
  } = useStore()
  const [newQuestion, setNewQuestion] = useState('')

  const handleAddQuestion = () => {
    const trimmed = newQuestion.trim()
    if (!trimmed) return
    if (soundEnabled) playPop()
    addQuestion(trimmed)
    addBrowniePoint()
    const leveled = addXP(3)
    setNewQuestion('')

    if (questions.length === 0 && unlockAchievement('first-question')) {
      triggerToast('Curious Mind! ❓', 'Asked your first question!', '💬')
    }
    if (questions.length >= 4 && unlockAchievement('five-questions')) {
      triggerToast('Question Master! 🏆', '5 questions asked!', '❓')
    }
    if (leveled) triggerToast('LEVEL UP! 🎉', 'You reached a new rank!', '⬆️')
  }

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
            Broadcast Mode
          </span>
        </h2>
        <p className={`mt-2 font-mono ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          [Module 2.2] – Show & Tell
        </p>
      </motion.div>

      {/* Team & Robot Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className={`p-6 rounded-lg shadow-lg mb-6 ${darkMode ? 'robo-card neon-glow' : 'robo-card-light shadow-lg'}`}
      >
        <div className="text-center mb-4">
          <h3 className="text-2xl font-bold text-cyan-500">
            {teamInfo.name || 'Team Name'}
          </h3>
          <div className="flex justify-center gap-2 mt-2 flex-wrap">
            {teamInfo.members.filter(Boolean).map((m, i) => (
              <span key={i} className={`px-3 py-1 rounded-md text-xs font-medium font-mono ${
                darkMode ? 'bg-gray-900/50 text-cyan-400 border border-cyan-500/20' : 'bg-cyan-100 text-cyan-700'
              }`}>
                👤 {m}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t dark:border-gray-700 pt-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Robot Info */}
            <div>
              <div className="text-center mb-3">
                <div className="text-4xl mb-2">🤖</div>
                <h4 className="text-xl font-bold">{robotData.name || 'Robot Name'}</h4>
                {robotData.personality && (
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Personality: {personalityLabels[robotData.personality]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <h5 className="font-semibold text-sm">Features:</h5>
                {robotData.features.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {robotData.features.map((f) => (
                      <span key={f} className={`px-2 py-1 rounded-md text-xs font-medium font-mono ${
                        darkMode ? 'bg-cyan-900/30 text-cyan-300 border border-cyan-500/20' : 'bg-cyan-100 text-cyan-700'
                      }`}>
                        {featureLabels[f] || f}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm italic text-gray-400">No features selected</p>
                )}
              </div>

              {robotData.tagline && (
                <div className={`mt-3 p-2 rounded-lg text-center italic text-sm font-mono ${
                  darkMode ? 'bg-emerald-900/20 text-emerald-300 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-700'
                }`}>
                  "{robotData.tagline}"
                </div>
              )}
            </div>

            {/* Drawing */}
            <div className="flex items-center justify-center">
              {drawingData ? (
                <img src={drawingData} alt="Robot drawing" className="max-h-52 rounded-xl shadow-md object-contain" />
              ) : (
                <div className={`w-full h-48 rounded-xl flex items-center justify-center ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <span className="text-gray-400">No drawing yet</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Roleplay Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className={`p-6 rounded-lg mb-6 ${darkMode ? 'robo-card' : 'robo-card-light shadow-md'}`}
      >
        <h3 className="text-lg font-bold mb-3">🎭 Roleplay: Explain Your Unit</h3>
        <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Imagine you're presenting your robot to the class. Pick how you'd describe it!
        </p>
        <select
          value={roleplayText}
          onChange={(e) => setRoleplayText(e.target.value)}
          className={`w-full p-3 rounded-lg border-2 transition-colors outline-none font-mono cursor-pointer ${
            darkMode
              ? 'bg-gray-900/50 border-cyan-500/20 focus:border-cyan-500 text-cyan-100'
              : 'bg-gray-50 border-gray-300 focus:border-cyan-500'
          }`}
        >
          <option value="">– Choose a presentation line –</option>
          {roleplayOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </motion.div>

      {/* Discussion Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className={`p-6 rounded-lg mb-8 ${darkMode ? 'robo-card' : 'robo-card-light shadow-md'}`}
      >
        <h3 className="text-lg font-bold mb-3">💬 Query Interface</h3>
        <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Ask a question about any team's robot! Each question earns +1 Brownie Point 🍫
        </p>

        <div className="flex gap-2 mb-4">
          <select
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            className={`flex-1 p-3 rounded-lg border-2 transition-colors outline-none font-mono cursor-pointer ${
              darkMode
                ? 'bg-gray-900/50 border-cyan-500/20 focus:border-cyan-500 text-cyan-100'
                : 'bg-gray-50 border-gray-300 focus:border-cyan-500'
            }`}
          >
            <option value="">– Pick a question to ask –</option>
            {discussionQuestionOptions.map((q) => (
              <option key={q} value={q}>{q}</option>
            ))}
          </select>
          <button
            onClick={handleAddQuestion}
            className={`px-4 py-3 font-medium rounded-lg font-mono transition-colors ${
              darkMode ? 'bg-cyan-600 text-black hover:bg-cyan-500' : 'bg-cyan-600 text-white hover:bg-cyan-700'
            }`}
          >
            Ask ⚡
          </button>
        </div>

        {questions.length > 0 && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {questions.map((q, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-3 rounded-lg flex items-start gap-2 ${
                  darkMode ? 'bg-gray-900/50 border border-cyan-500/10' : 'bg-cyan-50'
                }`}
              >
                <span className="text-lg">❓</span>
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{q}</span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(7)}
          className={`px-6 py-3 rounded-lg font-medium font-mono transition-colors ${
            darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-400 border border-gray-700' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          ◀ Back
        </button>
        <button
          onClick={() => setCurrentStep(9)}
          className={`px-6 py-3 font-medium font-mono rounded-lg transition-all ${
            darkMode
              ? 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-black hover:shadow-[0_0_15px_rgba(0,255,200,0.3)]'
              : 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-white hover:shadow-lg'
          }`}
        >
          Next: Points! ▶
        </button>
      </div>
    </div>
  )
}
