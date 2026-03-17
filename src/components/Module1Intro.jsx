import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../store'
import { playClick, playPop } from '../utils/sounds'
import { triggerToast } from './AchievementToast'
import TechIcon from './TechIcon'

const problemCards = [
  { emoji: '🧴', title: 'Lost Water Bottle', story: 'Riya left her water bottle in the cafeteria after lunch. By the time she remembered, it was gone. She checked lost & found, but dozens of bottles looked the same. She never got it back.' },
  { emoji: '🍱', title: 'Missing Lunch Box', story: 'Arjun\'s mom packed his favorite lunch. He left the box on a bench during recess. When he came back, someone had moved it. His lunch box sat unclaimed in lost & found for weeks.' },
  { emoji: '📓', title: 'Forgotten Notebook', story: 'Priya left her science notebook in the library. It had all her notes for the upcoming exam. She searched everywhere but couldn\'t find it — someone had turned it in, but she didn\'t know where to look.' },
  { emoji: '✏️', title: 'Lost Stationery', story: 'Karan\'s geometry box went missing from his desk. He had just gotten a new compass and protractor. Without them, he couldn\'t complete his math assignment that day.' },
]

const mediaLinks = [
  { url: 'https://share.google/yhnNGJmnaV59YfI2u', label: '📸 Resource 1' },
  { url: 'https://share.google/g2oIIpJPf42wmdrPg', label: '📸 Resource 2' },
  { url: 'https://share.google/pbNBqSRn1VIZVdCKB', label: '📸 Resource 3' },
  { url: 'https://share.google/ImdrijiiC473X1wFO', label: '📸 Resource 4' },
]

const robotAbilities = [
  { icon: 'search', text: 'Detect lost items using smart sensors' },
  { icon: 'id-card', text: 'Identify the owner automatically' },
  { icon: 'bell', text: 'Send reminders to students' },
  { icon: 'star', text: 'Encourage responsibility & ownership' },
]

export default function Module1Intro() {
  const { reflections, setReflection, setCurrentStep, darkMode, soundEnabled, addXP, unlockAchievement } = useStore()
  const [selectedCard, setSelectedCard] = useState(null)
  const reflectionXPGiven = useRef(false)

  // Grant XP when all reflections are filled
  useEffect(() => {
    if (!reflectionXPGiven.current && reflections.lost && reflections.feel && reflections.easier) {
      reflectionXPGiven.current = true
      const leveled = addXP(8)
      if (unlockAchievement('first-reflection')) {
        triggerToast('Deep Thinker! 🧠', 'Completed your first reflection!', '📝')
      }
      if (leveled) triggerToast('LEVEL UP! 🎉', 'You reached a new rank!', '⬆️')
    }
  }, [reflections])

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <span className="text-5xl">�</span>
        <h2 className="text-3xl md:text-4xl font-bold mt-2">
          <span className={`bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent ${darkMode ? 'neon-text' : ''}`}>
            System Scan: Discover!
          </span>
        </h2>
        <p className={`mt-2 font-mono ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          [Module 1.1] – Introduction
        </p>
      </motion.div>

      {/* Problem Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {problemCards.map((card, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCard(card)}
            className={`p-4 rounded-lg text-center transition-all ${
              darkMode ? 'robo-card hover:neon-glow' : 'robo-card-light hover:shadow-lg'
            }`}
          >
            <motion.div
              className="text-4xl mb-2"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            >
              {card.emoji}
            </motion.div>
            <div className="font-semibold text-sm">{card.title}</div>
          </motion.button>
        ))}
      </div>

      {/* Story Popup */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`max-w-md w-full p-6 rounded-lg shadow-2xl ${darkMode ? 'robo-card neon-glow-cyan' : 'robo-card-light'}`}
            >
              <div className="text-5xl text-center mb-3">{selectedCard.emoji}</div>
              <h3 className="text-xl font-bold text-center mb-3">{selectedCard.title}</h3>
              <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {selectedCard.story}
              </p>
              <button
                onClick={() => setSelectedCard(null)}
                className={`mt-4 w-full py-2 rounded-lg transition-colors ${darkMode ? 'bg-cyan-600 text-black hover:bg-cyan-500' : 'bg-cyan-600 text-white hover:bg-cyan-700'}`}
              >
                Got it! ✓
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={`p-6 rounded-lg mb-8 ${darkMode ? 'robo-card' : 'robo-card-light shadow-md'}`}
      >
        <p className={`text-base leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          📖 Many students accidentally leave behind items like water bottles, lunch boxes, and notebooks. 
          These items often end up in the school's lost-and-found box, where they stay for weeks — because no one 
          knows who the owner is. What if there was a smarter way to solve this?
        </p>
      </motion.div>

      {/* Media Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {mediaLinks.map((link, i) => (
          <motion.a
            key={i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            className={`p-4 rounded-lg text-center font-medium font-mono transition-colors ${
              darkMode ? 'robo-card hover:neon-glow text-cyan-400' : 'robo-card-light hover:shadow-lg text-cyan-700'
            }`}
          >
            {link.label}
          </motion.a>
        ))}
      </div>

      {/* Concept Highlight */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className={`p-6 rounded-lg mb-8 ${darkMode ? 'bg-gradient-to-r from-cyan-900 to-emerald-900 text-cyan-100 neon-glow-cyan' : 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-white shadow-md'}`}
      >
        <h3 className="text-xl font-bold mb-3">💡 Imagine a smart and friendly robot…</h3>
        <p className="text-sm opacity-90 mb-4">
          A robot that lives in your school and helps return lost items to their owners! What would it look like? What could it do?
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {robotAbilities.map((ability, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="flex items-center gap-2 bg-white/10 rounded-lg p-3 border border-white/10"
            >
              <div className="text-cyan-400">
                <TechIcon type={ability.icon} />
              </div>
              <span className="text-sm font-medium">{ability.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Reflection Inputs */}
      <div className={`p-6 rounded-lg mb-8 ${darkMode ? 'robo-card' : 'robo-card-light shadow-md'}`}>
        <h3 className="text-xl font-bold mb-4">🔧 Reflection Protocol</h3>
        <div className="space-y-4">
          {[
            { key: 'lost', label: 'Have you ever lost something at school? What was it?', options: ['Water bottle', 'Lunch box', 'Notebook', 'Eraser / Stationery', 'Bag / Jacket', 'Pencil case', 'Umbrella', 'Something else'] },
            { key: 'feel', label: 'How did you feel when you lost it?', options: ['Sad 😢', 'Worried 😟', 'Frustrated 😤', 'Panicked 😰', 'Upset 😞', 'Confused 🤔', 'Angry 😠'] },
            { key: 'easier', label: 'What could make returning lost items easier?', options: ['A smart tracking robot 🤖', 'Name tags on all items 🏷️', 'Lost & found alerts on phone 📱', 'Smart sensors in school 📡', 'A robot that announces found items 📢', 'Color-coded labels for classes 🎨'] },
          ].map((q) => (
            <div key={q.key}>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {q.label}
              </label>
              <select
                value={reflections[q.key]}
                onChange={(e) => { setReflection(q.key, e.target.value); if (soundEnabled) playClick() }}
                className={`w-full p-3 rounded-lg border-2 transition-colors ${
                  darkMode
                    ? 'bg-gray-900/50 border-cyan-500/20 focus:border-cyan-500 text-cyan-100'
                    : 'bg-gray-50 border-gray-300 focus:border-cyan-500'
                } outline-none font-mono cursor-pointer`}
              >
                <option value="">– Pick one –</option>
                {q.options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(0)}
          className={`px-6 py-3 rounded-lg font-medium font-mono transition-colors ${
            darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-400 border border-gray-700' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          ◀ Back
        </button>
        <button
          onClick={() => setCurrentStep(2)}
          className={`px-6 py-3 font-medium font-mono rounded-lg transition-all ${
            darkMode
              ? 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-black hover:shadow-[0_0_15px_rgba(0,255,200,0.3)]'
              : 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-white hover:shadow-lg'
          }`}
        >
          Next: Watch & Learn ▶
        </button>
      </div>
    </div>
  )
}
