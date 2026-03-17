import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import useStore from '../store'
import { playClick, playPop, playLevelUp } from '../utils/sounds'
import RobotAvatar from './RobotAvatar'

// Typewriter hook
function useTypewriter(texts, speed = 60, pause = 2000) {
  const [display, setDisplay] = useState('')
  const [textIndex, setTextIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const currentText = texts[textIndex]
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplay(currentText.slice(0, charIndex + 1))
        if (charIndex + 1 === currentText.length) {
          setTimeout(() => setDeleting(true), pause)
        } else {
          setCharIndex(c => c + 1)
        }
      } else {
        setDisplay(currentText.slice(0, charIndex))
        if (charIndex === 0) {
          setDeleting(false)
          setTextIndex((textIndex + 1) % texts.length)
        } else {
          setCharIndex(c => c - 1)
        }
      }
    }, deleting ? speed / 2 : speed)
    return () => clearTimeout(timeout)
  }, [charIndex, deleting, textIndex, texts, speed, pause])

  return display
}

import TechIcon from './TechIcon'

export default function LandingPage() {
  const { setCurrentStep, darkMode, soundEnabled, xp, getLevel } = useStore()
  const [robotClicks, setRobotClicks] = useState(0)
  const [easterEggMsg, setEasterEggMsg] = useState('')
  const level = getLevel()

  const easterEggMessages = [
    'Beep boop! 🤖',
    'Hey, stop poking me! 😆',
    'That tickles my circuits! ⚡',
    'I\'m charging up! 🔋',
    '*robot dance* 🕺🤖',
    'You found a secret! +0 XP... just kidding! 😜',
    'Are we best friends now? 💙',
    'MAXIMUM POWER! 💪⚡',
    '01101000 01101001 (that\'s "hi"!) 👋',
    '🎵 Doo doo doo doo doo 🎵',
  ]

  const handleRobotClick = () => {
    if (soundEnabled) playPop()
    const msg = easterEggMessages[robotClicks % easterEggMessages.length]
    setEasterEggMsg(msg)
    setRobotClicks(c => c + 1)
    setTimeout(() => setEasterEggMsg(''), 2500)
    if (robotClicks === 9 && soundEnabled) playLevelUp()
  }

  const typedText = useTypewriter([
    'The Lost & Found Robot Challenge_',
    'Design your own Helper Bot_',
    'Build something AWESOME_',
    'Become a Robot Legend_',
  ], 70, 2500)

  return (
    <div className="max-w-4xl mx-auto px-4 text-center relative">
      {/* Orbiting icons around the robot */}
      <div className="relative inline-block mb-6">
        {['bolt', 'wrench', 'lightbulb', 'star'].map((icon, i) => (
          <motion.div
            key={i}
            className="absolute text-cyan-400 hidden md:block" // Hide orbiting icons on mobile
            style={{ top: '50%', left: '50%' }}
            animate={{
              x: [Math.cos((i * Math.PI) / 2) * 70, Math.cos((i * Math.PI) / 2 + Math.PI * 2) * 70],
              y: [Math.sin((i * Math.PI) / 2) * 70, Math.sin((i * Math.PI) / 2 + Math.PI * 2) * 70],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          >
            <TechIcon type={icon} />
          </motion.div>
        ))}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="w-32 h-32 md:w-48 md:h-48 drop-shadow-[0_0_25px_rgba(0,255,200,0.4)] cursor-pointer select-none pulse-ring inline-block"
          onClick={handleRobotClick}
          whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
          whileTap={{ scale: 0.85, rotate: 20 }}
        >
          <RobotAvatar emotion={robotClicks > 0 ? 'excited' : 'idle'} />
        </motion.div>
      </div>

      {/* Easter egg message */}
      {easterEggMsg && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className={`mb-4 px-4 py-2 rounded-xl text-sm font-bold inline-block ${darkMode ? 'bg-gray-800 text-cyan-300 border border-cyan-500/30' : 'bg-white text-cyan-700 shadow-lg border border-cyan-200'}`}
        >
          {easterEggMsg}
          {robotClicks >= 10 && <span className="ml-2">🏆 Easter Egg Hunter!</span>}
        </motion.div>
      )}

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-4xl md:text-6xl font-extrabold mb-4"
      >
        <span className={`bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-300 bg-clip-text text-transparent glitch-text ${darkMode ? 'neon-text' : ''}`}>
          Bot-tastic School Buddy
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className={`text-xl md:text-2xl mb-2 font-mono ${darkMode ? 'text-cyan-300/80' : 'text-slate-600'}`}
      >
        <span className="typewriter-cursor">{'>'} {typedText}</span>
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className={`text-base md:text-lg mb-10 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
      >
        Design, Build & Present your own Lost & Found Helper Robot!
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
      >
        <button
          onClick={() => { if (soundEnabled) playClick(); setCurrentStep(1) }}
          className={`px-8 py-4 font-bold text-lg rounded-lg transition-all duration-300 ${
            darkMode
              ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-black shadow-[0_0_20px_rgba(0,255,200,0.3)] hover:shadow-[0_0_30px_rgba(0,255,200,0.5)] hover:scale-105'
              : 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-white shadow-xl hover:shadow-2xl hover:scale-105'
          }`}
        >
          ⚡ Initialize Adventure
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
      >
        {[
          { emoji: '📡', title: 'SCAN', desc: 'Detect problems', color: 'from-cyan-500/20 to-cyan-500/5' },
          { emoji: '🧠', title: 'LEARN', desc: 'Process data', color: 'from-emerald-500/20 to-emerald-500/5' },
          { emoji: '🤖', title: 'BUILD', desc: 'Construct bot', color: 'from-violet-500/20 to-violet-500/5' },
          { emoji: '📡', title: 'TRANSMIT', desc: 'Share ideas', color: 'from-amber-500/20 to-amber-500/5' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30, rotate: -5 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ delay: 1.3 + i * 0.15, type: 'spring' }}
            whileHover={{ scale: 1.1, y: -8, rotate: [0, -3, 3, 0] }}
            whileTap={{ scale: 0.95 }}
            className={`p-4 rounded-lg cursor-pointer hover-lift ${darkMode ? 'robo-card neon-glow' : 'robo-card-light shadow-md'} bg-gradient-to-b ${item.color}`}
          >
            <div className="text-3xl mb-2">{item.emoji}</div>
            <div className={`font-bold text-sm ${darkMode ? 'text-cyan-400' : 'text-slate-700'}`}>{item.title}</div>
            <div className={`text-xs font-mono ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{item.desc}</div>
          </motion.div>
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className={`mt-8 text-sm font-mono ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}
      >
        [SYSTEM] For students aged 10–16 • A gamified learning adventure ⚡
        {xp > 0 && ` • ${level.emoji} Level ${level.level}: ${level.name} • ${xp} XP`}
      </motion.p>
    </div>
  )
}
