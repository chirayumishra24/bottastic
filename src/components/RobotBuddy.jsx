import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../store'
import { playPop } from '../utils/sounds'
import RobotAvatar from './RobotAvatar'

const buddyMessages = {
  0: [
    "Hey there, future inventor! Ready to build something AWESOME? 🚀",
    "Welcome, cadet! I'm Sparky, your robot buddy! Click me! 🤖",
    "Psst... click that big button to start our adventure! ⚡",
  ],
  1: [
    "Ooh, those stories are wild! Have you ever lost something? 🤔",
    "Tap the cards to read real student stories! 📖",
    "Don't forget to write your reflections below! ✍️",
  ],
  2: [
    "Time to learn! Watch the video carefully... there might be quiz questions! 👀",
    "Robots helping in schools? How cool is THAT?! 🏫🤖",
    "Write down what you learn — it helps your brain remember! 🧠",
  ],
  3: [
    "Quiz time! Don't worry, I believe in you! 💪",
    "Take your time... or race the clock! Your call! ⏰",
    "Get a streak going for BONUS XP! 🔥🔥🔥",
  ],
  4: [
    "Time to form your squad! Every great invention needs a team! 👥",
    "Pick a LEGENDARY team name! Something epic! ⚡",
    "Read the mission carefully... your adventure depends on it! 🎯",
  ],
  5: [
    "Assembly time! Build the coolest robot EVER! 🔧",
    "Give your robot a fun personality — detectives are my fav! 🕵️",
    "Don't forget a catchy tagline! Make people laugh! 😂",
  ],
  6: [
    "Unleash your inner artist! Draw your dream robot! 🎨",
    "Pro tip: use the stickers to add fun details! 😎",
    "There are no mistakes in art — only happy accidents! 🖌️",
  ],
  7: [
    "Whoa, your flyer looks AMAZING! You could be a designer! 📄✨",
    "Download it and show your friends! They'll be impressed! 📥",
    "Every great product needs great marketing! 📢",
  ],
  8: [
    "Presentation time! Show the world what you made! 🎤",
    "Ask a question to earn Power Cores! +1 per question! ⚡",
    "Don't be shy — the best ideas come from questions! 💬",
  ],
  9: [
    "Look at all those Power Cores! You're CRUSHING it! ⚡",
    "Keep asking questions to level up! 📈",
    "Badges are waiting to be unlocked! Can you get them ALL? 🏅",
  ],
  10: [
    "WOW! You completed the ENTIRE mission! You're a legend! 🏆",
    "You've unlocked all these skills — that's incredible! 🌟",
    "Share what you built with your friends and family! 🎉",
  ],
}

const clickReactions = [
  { emotion: 'happy', msg: "Hehe, that tickles!" },
  { emotion: 'idle', msg: "BEEP BOOP! You found me!" },
  { emotion: 'celebrating', msg: "♪ Doo doo doo ♪" },
  { emotion: 'excited', msg: "You're a STAR!" },
  { emotion: 'cool', msg: "We make a great team!" },
  { emotion: 'wink', msg: "This is so much fun!" },
  { emotion: 'thinking', msg: "Juice break? No? Ok let's GO!" },
  { emotion: 'excited', msg: "My circuits are tingling!" },
  { emotion: 'celebrating', msg: "This is the best day EVER!" },
]

export default function RobotBuddy() {
  const { currentStep, darkMode } = useStore()
  const [message, setMessage] = useState('')
  const [emotion, setEmotion] = useState('idle')  // controls SVG face
  const [showMessage, setShowMessage] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [isMinimized, setIsMinimized] = useState(false)

  // Show contextual message every 12 seconds
  useEffect(() => {
    const msgs = buddyMessages[currentStep] || buddyMessages[0]
    let msgIndex = 0

    const showNext = () => {
      setMessage(msgs[msgIndex % msgs.length])
      setShowMessage(true)
      setEmotion(currentStep === 3 ? 'thinking' : currentStep === 10 ? 'celebrating' : 'happy')
      msgIndex++

      setTimeout(() => {
        setShowMessage(false)
        setEmotion('idle')
      }, 5000)
    }

    // Show first message after 2 seconds
    const initial = setTimeout(showNext, 2000)
    const interval = setInterval(showNext, 15000)

    return () => {
      clearTimeout(initial)
      clearInterval(interval)
    }
  }, [currentStep])

  const handleClick = useCallback(() => {
    playPop()
    const reaction = clickReactions[clickCount % clickReactions.length]
    setMessage(reaction.msg)
    setEmotion(reaction.emotion)
    setShowMessage(true)
    setClickCount(c => c + 1)

    setTimeout(() => {
      setShowMessage(false)
      setEmotion('idle')
    }, 3000)
  }, [clickCount])

  if (isMinimized) {
    return (
      <motion.button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 z-[100] w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg border-2 border-white"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-9 h-9"><RobotAvatar emotion="idle" /></div>
      </motion.button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-[100]">
      {/* Speech bubble */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            className={`absolute bottom-24 right-0 w-60 p-4 rounded-2xl text-sm font-medium shadow-xl ${
              darkMode
                ? 'bg-gray-800 text-cyan-100 border border-cyan-500/30'
                : 'bg-white text-gray-800 border border-cyan-200'
            }`}
          >
            {/* Speech bubble arrow */}
            <div className={`absolute -bottom-2 right-8 w-4 h-4 rotate-45 ${
              darkMode ? 'bg-gray-800 border-r border-b border-cyan-500/30' : 'bg-white border-r border-b border-cyan-200'
            }`} />
            <p className="relative z-10 leading-relaxed font-sans">{message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Robot buddy */}
      <div className="relative">
        {/* Minimize button */}
        <button
          onClick={() => setIsMinimized(true)}
          className={`absolute -top-2 -left-2 w-6 h-6 rounded-full text-xs flex items-center justify-center z-10 transition-colors ${
            darkMode ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' : 'bg-white text-gray-400 hover:text-gray-600 shadow-md'
          }`}
        >
          ✕
        </button>

        <motion.button
          onClick={handleClick}
          className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl cursor-pointer select-none overflow-hidden ${
             darkMode ? 'bg-gray-900 border-2 border-cyan-500' : 'bg-white border-2 border-cyan-300' 
          }`}
          animate={{
            y: [0, -6, 0],
            rotate: emotion === 'excited' ? [0, -5, 5, -5, 0] : 0,
          }}
          transition={{
            y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: 0.5 },
          }}
          whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="w-16 h-16 pointer-events-none">
             <RobotAvatar emotion={emotion} />
          </div>
        </motion.button>

        {/* XP sparkle ring when celebrating */}
        {emotion === 'celebrating' && (
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-yellow-400"
            animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}
      </div>
    </div>
  )
}
