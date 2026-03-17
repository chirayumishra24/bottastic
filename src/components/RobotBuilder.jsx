import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import useStore from '../store'
import { playClick, playPop } from '../utils/sounds'
import { triggerToast } from './AchievementToast'

const personalities = [
  { value: 'funny', emoji: '😂', label: 'Funny' },
  { value: 'detective', emoji: '🕵️', label: 'Detective' },
  { value: 'energetic', emoji: '⚡', label: 'Energetic' },
  { value: 'friendly', emoji: '🤗', label: 'Friendly' },
]

const features = [
  { value: 'scanner', emoji: '📡', label: 'Item Scanner' },
  { value: 'owner-finder', emoji: '🔍', label: 'Owner Finder' },
  { value: 'alerts', emoji: '🔔', label: 'Smart Alerts' },
  { value: 'voice', emoji: '🗣️', label: 'Voice Messages' },
  { value: 'tracking', emoji: '📍', label: 'Item Tracking' },
]

const funElements = [
  { value: 'emojis', emoji: '😎', label: 'Fun Emojis' },
  { value: 'sounds', emoji: '🔊', label: 'Sound Effects' },
  { value: 'messages', emoji: '💬', label: 'Funny Messages' },
]

const taglineSuggestions = [
  "Your bottle misses you! 🧴💔",
  "Lost something? I've got you! 🤖✨",
  "No item left behind! 🦸‍♂️",
  "Finders keepers? Nope, finders RETURNERS! 🔄",
  "I sniff out lost stuff! 🐕🔍",
]

const robotNameOptions = [
  'FinderBot 🔍',
  'LostBuddy 🤝',
  'ReturnHero 🦸',
  'TrackMaster 📡',
  'ScanBot 3000 🤖',
  'ItemGuardian 🛡️',
  'RescueRover 🐕',
  'SmartSeeker ✨',
]

const descriptionOptions = [
  'A friendly robot that scans the school for lost items and returns them to owners',
  'A detective robot that tracks items using smart sensors and sends alerts',
  'A funny robot that cracks jokes while helping students find their stuff',
  'An energetic robot that zooms around school collecting and returning lost items',
  'A smart guardian robot that tags items and notifies students instantly',
]

export default function RobotBuilder() {
  const { robotData, setRobotField, toggleRobotFeature, toggleFunElement, setCurrentStep, darkMode, soundEnabled, addXP, unlockAchievement } = useStore()
  const xpGiven = useRef(false)

  // Grant XP when robot has name + personality + features
  useEffect(() => {
    if (!xpGiven.current && robotData.name && robotData.personality && robotData.features.length >= 2) {
      xpGiven.current = true
      const leveled = addXP(12)
      if (unlockAchievement('robot-built')) {
        triggerToast('Robot Inventor! 🤖', 'Built your first robot!', '🔧')
      }
      if (leveled) triggerToast('LEVEL UP! 🎉', 'You reached a new rank!', '⬆️')
    }
  }, [robotData])

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
            Assembly Lab
          </span>
        </h2>
        <p className={`mt-2 font-mono ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Construct your Lost & Found Unit!
        </p>
      </motion.div>

      {/* Robot Name */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`p-6 rounded-lg mb-6 ${darkMode ? 'robo-card' : 'robo-card-light shadow-md'}`}
      >
        <h3 className="text-lg font-bold mb-3">🤖 Unit Designation</h3>
        <select
          value={robotData.name}
          onChange={(e) => setRobotField('name', e.target.value)}
          className={`w-full p-3 rounded-lg border-2 transition-colors outline-none text-lg font-medium font-mono cursor-pointer ${
            darkMode
              ? 'bg-gray-900/50 border-cyan-500/20 focus:border-cyan-500 text-cyan-100'
              : 'bg-gray-50 border-gray-300 focus:border-cyan-500'
          }`}
        >
          <option value="">– Choose a name for your robot –</option>
          {robotNameOptions.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </motion.div>

      {/* Personality */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={`p-6 rounded-lg mb-6 ${darkMode ? 'robo-card' : 'robo-card-light shadow-md'}`}
      >
        <h3 className="text-lg font-bold mb-3">🎭 Core Behavior</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {personalities.map((p) => (
            <motion.button
              key={p.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setRobotField('personality', p.value)}
              className={`p-4 rounded-lg border-2 text-center transition-all ${
                robotData.personality === p.value
                  ? darkMode ? 'border-cyan-500 bg-cyan-900/20 shadow-md neon-glow-cyan' : 'border-cyan-500 bg-cyan-50 shadow-md'
                  : darkMode
                  ? 'border-gray-700 bg-gray-900/50 hover:border-gray-600'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              }`}
            >
              <div className="text-3xl mb-1">{p.emoji}</div>
              <div className="text-sm font-medium">{p.label}</div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className={`p-6 rounded-lg mb-6 ${darkMode ? 'robo-card' : 'robo-card-light shadow-md'}`}
      >
        <h3 className="text-lg font-bold mb-1">⚙️ Modules</h3>
        <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Select 2–3 features for your robot</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {features.map((f) => (
            <motion.button
              key={f.value}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => toggleRobotFeature(f.value)}
              className={`p-4 rounded-lg border-2 text-center transition-all ${
                robotData.features.includes(f.value)
                  ? darkMode ? 'border-cyan-500 bg-cyan-900/20 shadow-md neon-glow-cyan' : 'border-cyan-500 bg-cyan-50 shadow-md'
                  : darkMode
                  ? 'border-gray-700 bg-gray-900/50 hover:border-gray-600'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-1">{f.emoji}</div>
              <div className="text-sm font-medium">{f.label}</div>
              {robotData.features.includes(f.value) && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-cyan-500 text-xs mt-1"
                >
                  ✓ Selected
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Fun Elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className={`p-6 rounded-lg mb-6 ${darkMode ? 'robo-card' : 'robo-card-light shadow-md'}`}
      >
        <h3 className="text-lg font-bold mb-3">⚡ Fun Protocols</h3>
        <div className="grid grid-cols-3 gap-3">
          {funElements.map((f) => (
            <motion.button
              key={f.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleFunElement(f.value)}
              className={`p-3 rounded-lg border-2 text-center transition-all ${
                robotData.funElements.includes(f.value)
                  ? darkMode ? 'border-emerald-500 bg-emerald-900/20' : 'border-emerald-500 bg-emerald-50'
                  : darkMode
                  ? 'border-gray-700 bg-gray-900/50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="text-2xl">{f.emoji}</div>
              <div className="text-xs font-medium mt-1">{f.label}</div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Tagline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className={`p-6 rounded-lg mb-6 ${darkMode ? 'robo-card' : 'robo-card-light shadow-md'}`}
      >
        <h3 className="text-lg font-bold mb-3">🏷️ Catchphrase</h3>
        <select
          value={robotData.tagline}
          onChange={(e) => setRobotField('tagline', e.target.value)}
          className={`w-full p-3 rounded-lg border-2 transition-colors outline-none font-mono cursor-pointer ${
            darkMode
              ? 'bg-gray-900/50 border-cyan-500/20 focus:border-cyan-500 text-cyan-100'
              : 'bg-gray-50 border-gray-300 focus:border-cyan-500'
          }`}
        >
          <option value="">– Pick a catchphrase –</option>
          {taglineSuggestions.map((tag) => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </motion.div>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className={`p-6 rounded-lg mb-8 ${darkMode ? 'robo-card' : 'robo-card-light shadow-md'}`}
      >
        <h3 className="text-lg font-bold mb-3">📝 Specifications</h3>
        <select
          value={robotData.description}
          onChange={(e) => setRobotField('description', e.target.value)}
          className={`w-full p-3 rounded-lg border-2 transition-colors outline-none font-mono cursor-pointer ${
            darkMode
              ? 'bg-gray-900/50 border-cyan-500/20 focus:border-cyan-500 text-cyan-100'
              : 'bg-gray-50 border-gray-300 focus:border-cyan-500'
          }`}
        >
          <option value="">– Choose a description –</option>
          {descriptionOptions.map((desc) => (
            <option key={desc} value={desc}>{desc}</option>
          ))}
        </select>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(4)}
          className={`px-6 py-3 rounded-lg font-medium font-mono transition-colors ${
            darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-400 border border-gray-700' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          ◀ Back
        </button>
        <button
          onClick={() => setCurrentStep(6)}
          className={`px-6 py-3 font-medium font-mono rounded-lg transition-all ${
            darkMode
              ? 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-black hover:shadow-[0_0_15px_rgba(0,255,200,0.3)]'
              : 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-white hover:shadow-lg'
          }`}
        >
          Next: Draw Your Robot! ▶
        </button>
      </div>
    </div>
  )
}
